import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { saveUser } from "../services/auth";
import AuthShell from "../components/AuthShell";

const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 " +
  "placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

const ROLES = [
  { key: "EMPLOYEE", label: "Employee" },
  { key: "ADMIN", label: "Admin" },
];

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("EMPLOYEE");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setError("Enter your email and password.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
        role,
      });
      const { userId, name, role: returnedRole } = res.data;
      saveUser({ userId, name, role: returnedRole, email: form.email });
      navigate(returnedRole === "ADMIN" ? "/admin" : "/employee");
    } catch (err) {
      setError(
        err.response?.status === 403
          ? `That account isn't registered as ${role === "ADMIN" ? "an admin" : "an employee"}.`
          : "Invalid email or password."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Choose your role, then enter your details."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-700">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <span className="mb-1.5 block text-xs font-medium text-slate-700">Sign in as</span>
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1" role="group">
            {ROLES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                aria-pressed={role === r.key}
                className={`rounded-md py-2 text-sm font-medium transition ${
                  role === r.key
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="l-email" className="mb-1.5 block text-xs font-medium text-slate-700">Email</label>
          <input id="l-email" type="email" autoComplete="username"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@company.com" className={field} />
        </div>

        <div>
          <label htmlFor="l-pass" className="mb-1.5 block text-xs font-medium text-slate-700">Password</label>
          <input id="l-pass" type="password" autoComplete="current-password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••" className={field} />
        </div>

        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

        <button type="submit" disabled={busy}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-sm
                     transition hover:bg-indigo-700 disabled:opacity-60">
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-slate-400">
          The server sleeps when idle — the first sign-in can take up to a minute.
        </p>
      </form>
    </AuthShell>
  );
}
