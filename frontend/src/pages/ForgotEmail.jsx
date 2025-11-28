import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ForgotEmail() {
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      setMessage(
        "✅ If your account exists, an email reminder has been sent!"
      );
    }, 1000);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div
        className="card w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl border border-gray-200 p-8 animate-slideIn"
        data-aos="fade-up"
      >
        <h2 className="text-2xl font-bold text-center mb-4 gradient-text">
          Recover Your Email
        </h2>

        {!message ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-600 text-sm text-center mb-2">
              Enter your registered phone number or username.
            </p>
            <input
              type="text"
              placeholder="Enter phone or username"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
            <button className="btn w-full mt-3">Submit</button>
          </form>
        ) : (
          <p className="text-center text-sm text-gray-700">{message}</p>
        )}

        <p className="text-center text-sm mt-4">
          <Link to="/login" className="text-indigo-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}


