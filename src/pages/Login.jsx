import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { saveUser } from "../services/auth";
import AuthShell from "../components/AuthShell";

const field = "field";

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
          <Link to="/register" className="font-medium text-violet-300 hover:text-violet-200">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <span className="mb-1.5 block text-xs font-medium text-slate-300">Sign in as</span>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-white/[0.05] p-1 ring-1 ring-inset ring-white/10" role="group">
            {ROLES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                aria-pressed={role === r.key}
                className={`rounded-md py-2 text-sm font-medium transition ${
                  role === r.key
                    ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-[0_8px_20px_-10px_rgba(124,92,255,.9)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="l-email" className="mb-1.5 block text-xs font-medium text-slate-300">Email</label>
          <input id="l-email" type="email" autoComplete="username"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@company.com" className={field} />
        </div>

        <div>
          <label htmlFor="l-pass" className="mb-1.5 block text-xs font-medium text-slate-300">Password</label>
          <input id="l-pass" type="password" autoComplete="current-password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••" className={field} />
        </div>

        {error && <p role="alert" className="rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}

        <button type="submit" disabled={busy}
          className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 py-2.5 text-sm font-medium text-white shadow-sm
                     shadow-[0_10px_26px_-12px_rgba(124,92,255,.9)] transition hover:from-violet-400 hover:to-indigo-400 disabled:opacity-60">
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-slate-500">
          The server sleeps when idle — the first sign-in can take up to a minute.
        </p>
      </form>
    </AuthShell>
  );
}
