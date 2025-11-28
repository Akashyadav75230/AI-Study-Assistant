import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";
import {
  Brain, ArrowLeft, ArrowRight, Trophy, Sparkles
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Quiz() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  async function load() {
    try {
      const { data } = await api().get("/ai/quiz/" + id);
      if ((data.questions || []).length) setQuestions(data.questions);
      else {
        const r = await api().post("/ai/quiz/" + id);
        setQuestions(r.data.questions || []);
      }
    } catch (err) {
      console.error("Quiz load error:", err);
      alert("Failed to load quiz. Please try again after a few seconds.");
    }
  }

  useEffect(() => {
    load();
    AOS.init({ duration: 700, once: true });
  }, [id]);

  if (!questions.length)
    return (
      <div className="card text-center animate-fadeIn">
        <Sparkles className="w-6 h-6 mx-auto text-indigo-600 animate-spin mb-3" />
        <p className="text-gray-600 font-medium">
          Preparing your AI-powered quiz...
        </p>
        <div className="w-40 h-1 bg-gray-200 rounded-full mx-auto mt-3 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-[loading_1.2s_infinite]"></div>
        </div>
      </div>
    );

  const q = questions[i];

  function next() {
    if (selected === q.correctIndex) setScore(score + 1);
    setSelected(null);
    if (i < questions.length - 1) setI(i + 1);
    else setFinished(true);
  }

  function prev() {
    if (i > 0) setI(i - 1);
  }

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* 🌈 Header */}
      <div
        className="card bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white flex justify-between items-center"
        data-aos="fade-down"
      >
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Brain className="w-5 h-5 text-yellow-300" /> AI Quiz
        </h2>
        <div className="text-sm opacity-90">
          Question {i + 1} / {questions.length}
        </div>
      </div>

      {/* 📊 Progress Bar */}
      <div
        className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner"
        data-aos="fade-up"
      >
        <div
          className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-all duration-500"
          style={{ width: `${((i + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* ❓ Quiz Card */}
      {!finished ? (
        <div
          key={i}
          className="card bg-white/80 backdrop-blur-md border border-gray-200 shadow-md animate-fadeIn"
          data-aos="zoom-in"
        >
          <h3 className="text-lg font-semibold mb-4">{q.question}</h3>
          <div className="space-y-3">
            {q.options.map((opt, idx) => (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                  selected === idx
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setSelected(idx)}
              >
                <input
                  type="radio"
                  checked={selected === idx}
                  onChange={() => setSelected(idx)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              className="btn flex items-center gap-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={prev}
              disabled={i === 0}
            >
              <ArrowLeft className="w-4 h-4" /> Prev
            </button>
            <button
              className="btn flex items-center gap-1"
              onClick={next}
              disabled={selected === null}
            >
              {i === questions.length - 1 ? "Finish" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="card text-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl"
          data-aos="zoom-in"
        >
          <Trophy className="w-12 h-12 text-yellow-300 mx-auto mb-3 animate-float" />
          <h3 className="text-2xl font-bold mb-1">Quiz Completed!</h3>
          <p className="text-white/80 mb-4">
            You scored <strong>{score}</strong> out of {questions.length}
          </p>
          <div className="flex justify-center gap-3">
            <button
              className="btn bg-white text-indigo-600 hover:bg-gray-100"
              onClick={() => {
                setFinished(false);
                setI(0);
                setScore(0);
              }}
            >
              Try Again
            </button>
            <button
              className="btn bg-white text-purple-600 hover:bg-gray-100"
              onClick={() => window.history.back()}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
