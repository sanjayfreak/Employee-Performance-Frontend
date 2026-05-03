import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { saveUser } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("EMPLOYEE");

  const handleLogin = async () => {
    setError("");
    console.log("Sending role:", selectedRole); // 👈 debug
    try {
      const response = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
        role: selectedRole,
      });

      const { userId, name, role } = response.data;
      console.log("userId:", userId, "name:", name, "role:", role);
      saveUser({ userId, name, role });

      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Access denied. Wrong role selected.");
      } else {
        setError("Invalid email or password");
      }
      console.error(err);
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
            <p className="text-gray-400 text-xs">AI-powered employee performance monitoring</p>
          </div>
        </div>

        {/* Role Toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedRole("EMPLOYEE")}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition ${
              selectedRole === "EMPLOYEE"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }`}
          >
            Employee
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("ADMIN")}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition ${
              selectedRole === "ADMIN"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }`}
          >
            Admin
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

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

        {/* Sign In Button */}
        <button
          type="button"
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition"
        >
          Sign in
        </button>

        {/* Demo hint */}
        <p className="text-center text-gray-500 text-xs">
          Select your role then enter your credentials
        </p>

        {/* Register link */}
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}