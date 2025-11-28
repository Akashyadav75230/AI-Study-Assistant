import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await api().post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      nav("/");
    } catch (err) {
      alert("Invalid credentials, please try again.");
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* 🧠 Left Section - Hero Image */}
      <div
        className="hidden md:flex flex-1 justify-center items-center"
        data-aos="zoom-in"
      >
        <img
          src="/assets/hero.svg"
          alt="AI Learning"
          onLoad={() => setImgLoaded(true)}
          onError={() =>
            console.error("⚠️ hero.svg not found in /public/assets")
          }
          className="w-80 md:w-[400px] animate-float"
        />
        {!imgLoaded && (
          <p className="text-gray-500 text-sm mt-2">
            ⚠️ hero.svg missing or not loading
          </p>
        )}
      </div>

      {/* 🔐 Right Section - Login Form */}
      <div
        className="card w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl border border-gray-200 p-8 animate-slideIn mt-6 md:mt-0"
        data-aos="fade-left"
      >
        <h2 className="text-2xl font-bold text-center mb-6 gradient-text">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn w-full mt-3">Login</button>
        </form>

        {/* 🧾 Signup Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>

        {/* 🔗 Extra Recovery Options */}
        <div className="text-center text-sm mt-4 space-y-1">
          <p>
            <Link
              to="/forgot"
              className="text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Forgot password?
            </Link>
          </p>
          <p>
            <Link
              to="/forgot-email"
              className="text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Forgot email?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

