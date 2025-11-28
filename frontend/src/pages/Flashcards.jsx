import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";
import { Sparkles, ArrowLeft, ArrowRight, RefreshCcw } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Flashcards() {
  const { id } = useParams();
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      // ✅ Fixed endpoint (removed extra /api)
      const { data } = await api().get("/ai/flashcards/" + id);
      if ((data.cards || []).length) {
        setCards(data.cards);
      } else {
        // If no flashcards exist, generate them automatically
        const res = await api().post("/ai/flashcards/" + id);
        setCards(res.data.cards || []);
      }
    } catch (err) {
      console.error("Flashcards fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    AOS.init({ duration: 700, once: true });
  }, [id]);

  if (loading)
    return (
      <div className="card text-center animate-fadeIn">
        <p className="text-gray-500 flex justify-center items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" />
          Preparing flashcards...
        </p>
      </div>
    );

  if (!cards.length)
    return (
      <div className="card text-center animate-fadeIn">
        <p className="text-gray-500">No flashcards available yet.</p>
      </div>
    );

  const card = cards[index];

  function nextCard() {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % cards.length);
  }

  function prevCard() {
    setFlipped(false);
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }

  function resetDeck() {
    setIndex(0);
    setFlipped(false);
  }

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* 🌈 Header */}
      <div
        className="card bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white flex justify-between items-center"
        data-aos="fade-down"
      >
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          AI Flashcards
        </h2>
        <div className="text-sm opacity-90">
          Card {index + 1} / {cards.length}
        </div>
      </div>

      {/* 🃏 Flashcard */}
      <div
        className="flex justify-center"
        data-aos="zoom-in"
        onClick={() => setFlipped(!flipped)}
      >
        <div className="relative w-80 h-52 md:w-[420px] md:h-[260px] perspective-1000 cursor-pointer">
          <div
            className={`absolute inset-0 transition-transform duration-700 transform-style-3d ${
              flipped ? "rotate-y-180" : ""
            }`}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden card bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center text-center font-medium text-gray-800 text-lg p-4 shadow-lg">
              {card.front}
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 card bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-center text-center font-semibold text-lg p-4 shadow-xl">
              {card.back}
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 Controls */}
      <div
        className="flex justify-center gap-3"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <button
          className="btn flex items-center gap-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
          onClick={prevCard}
        >
          <ArrowLeft className="w-4 h-4" /> Prev
        </button>

        <button
          className="btn flex items-center gap-1 bg-white text-indigo-600 border border-indigo-400 hover:bg-indigo-50"
          onClick={resetDeck}
        >
          <RefreshCcw className="w-4 h-4" /> Restart
        </button>

        <button className="btn flex items-center gap-1" onClick={nextCard}>
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


