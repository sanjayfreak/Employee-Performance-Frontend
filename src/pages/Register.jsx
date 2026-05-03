import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", form);
      alert("Registered successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Error registering. Try again.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-950">
      <div className="bg-gray-800 p-10 rounded-2xl w-96 shadow-2xl flex flex-col gap-4">

        {/* Logo + Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-600 p-2 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">PerfTrack AI</h1>
            <p className="text-gray-400 text-xs">Create your account</p>
          </div>
        </div>

        {/* Role Toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "EMPLOYEE" })}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition ${
              form.role === "EMPLOYEE"
                ? "bg-gray-600 text-white"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }`}
          >
            Employee
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "ADMIN" })}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition ${
              form.role === "ADMIN"
                ? "bg-gray-600 text-white"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }`}
          >
            Admin
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">Full Name</label>
          <input
            className="bg-gray-700 text-white p-3 rounded-lg text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">Email</label>
          <input
            className="bg-gray-700 text-white p-3 rounded-lg text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@company.com"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">Password</label>
          <input
            type="password"
            className="bg-gray-700 text-white p-3 rounded-lg text-sm placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* Register Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition"
        >
          Create Account
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Sign in
          </span>
        </p>

      </div>
    </div>
  );
}