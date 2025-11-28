import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";
import { Upload, FileText, Calendar } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const nav = useNavigate();

  async function load() {
    const { data } = await api().get("/files");
    setFiles(data);
  }

  useEffect(() => {
    load();
    AOS.init({ duration: 800, once: true });
  }, []);

  async function upload(e) {
    e.preventDefault();
    if (!file) return alert("Please select a file first.");
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await api().post("/files/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setFiles([data, ...files]);
    setFile(null);
  }

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* 🌈 Hero Section (Resized and Centered) */}
      <section className="text-center py-10 md:py-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-lg max-w-4xl mx-auto">
        <div data-aos="fade-down">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight text-yellow-300">
            AI Study Assistant
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Upload your notes and let AI create instant summaries, flashcards, and quizzes for you.
          </p>
        </div>

        <img
          src="/assets/hero.svg"
          alt="AI Learning"
          className="w-52 md:w-64 mx-auto mt-6 animate-float"
          data-aos="zoom-in"
        />
      </section>

      {/* ⚙️ Upload Section */}
      <section
        data-aos="fade-up"
        className="grid md:grid-cols-2 gap-6 items-start"
      >
        <div className="card bg-white/80 backdrop-blur-md border border-gray-200 hover:shadow-glow transition">
          <h2 className="font-semibold text-xl mb-3 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-600" /> Upload a File
          </h2>
          <form
            className="flex flex-col sm:flex-row gap-3 items-center"
            onSubmit={upload}
          >
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="border border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button className="btn bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition">
              Upload
            </button>
          </form>
        </div>

        <div className="card bg-white/80 backdrop-blur-md border border-gray-200 hover:shadow-glow transition">
          <h2 className="font-semibold text-xl mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" /> Quick Links
          </h2>
          <div className="flex gap-3 flex-wrap">
            <Link
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition"
              to="/schedule"
            >
              Schedule Planner
            </Link>
          </div>
        </div>
      </section>

      {/* 📁 Files Section */}
      <section
        data-aos="fade-up"
        data-aos-delay="200"
        className="card bg-white/80 backdrop-blur-md border border-gray-200 shadow-md"
      >
        <h2 className="font-semibold text-xl mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" /> Your Uploaded Files
        </h2>

        {files.length === 0 ? (
          <p className="text-gray-500 text-sm">No files uploaded yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {files.map((f) => (
              <div
                key={f._id}
                className="p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
                data-aos="zoom-in"
              >
                <div className="font-medium text-gray-800 truncate">
                  {f.originalName}
                </div>
                <button
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm"
                  onClick={() => nav("/file/" + f._id)}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

