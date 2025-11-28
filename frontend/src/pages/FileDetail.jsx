import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";
import { FileText, Loader2, Sparkles, BookOpenCheck, Brain } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function FileDetail() {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function loadFile() {
    const { data } = await api().get("/files/" + id);
    setFile(data);
    const s = await api().get("/api/ai/summary/" + id);
    setSummary(s.data?.content || "");
  }

  useEffect(() => {
    loadFile();
    AOS.init({ duration: 700, once: true });
  }, [id]);

  async function summarize() {
    setLoading(true);
    const { data } = await api().post("/ai/summarize/" + id);
    setSummary(data.content);
    setLoading(false);
  }

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* 📄 File Header Card */}
      {file && (
        <div
          className="card bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl"
          data-aos="fade-down"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-yellow-300" />
              <h1 className="text-2xl font-bold">{file.originalName}</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={summarize}
                className="btn bg-white text-indigo-600 hover:bg-gray-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Working...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Summarize
                  </>
                )}
              </button>

              <button
                className="btn bg-white text-purple-600 hover:bg-gray-100"
                onClick={() => nav("/flashcards/" + id)}
              >
                <BookOpenCheck className="w-4 h-4" /> Flashcards
              </button>

              <button
                className="btn bg-white text-pink-600 hover:bg-gray-100"
                onClick={() => nav("/quiz/" + id)}
              >
                <Brain className="w-4 h-4" /> Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🧠 Summary Section */}
      <div
        className="card bg-white/80 backdrop-blur-md border border-gray-200 shadow-md"
        data-aos="fade-up"
      >
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" /> Summary
        </h2>

        <div className="p-3 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap animate-slideIn">
          {summary ? (
            <div className="prose max-w-none">{summary}</div>
          ) : (
            <div className="text-gray-500 italic">No summary yet.</div>
          )}
        </div>
      </div>

      {/* 🌈 Tip Section */}
      <div
        className="p-4 rounded-2xl bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border border-indigo-200 text-gray-700 text-sm"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        💡 <strong>Tip:</strong> You can create <em>flashcards</em> and <em>quizzes</em> from this file
        instantly. Just click the respective buttons above.
      </div>
    </div>
  );
}
