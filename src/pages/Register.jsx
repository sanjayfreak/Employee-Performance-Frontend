import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthShell from "../components/AuthShell";

const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 " +
  "placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

const ROLES = [
  { key: "EMPLOYEE", label: "Employee" },
  { key: "ADMIN", label: "Admin" },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EMPLOYEE" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Fill in every field.");
      return;
    }
    if (form.password.length < 6) {
      setError("Use at least 6 characters for your password.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await api.post("/auth/register", form);
      setNotice("Account created. Taking you to sign in…");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      const data = err.response?.data;
      setError(typeof data === "string" && data ? data : "Could not register. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Register as an employee or an admin."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-700">Sign in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <span className="mb-1.5 block text-xs font-medium text-slate-700">Register as</span>
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1" role="group">
            {ROLES.map((r) => (
              <button key={r.key} type="button"
                onClick={() => setForm({ ...form, role: r.key })}
                aria-pressed={form.role === r.key}
                className={`rounded-md py-2 text-sm font-medium transition ${
                  form.role === r.key
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="r-name" className="mb-1.5 block text-xs font-medium text-slate-700">Full name</label>
          <input id="r-name" value={form.name} onChange={set("name")} placeholder="Sanjay Kumar" className={field} />
        </div>

        <div>
          <label htmlFor="r-email" className="mb-1.5 block text-xs font-medium text-slate-700">Email</label>
          <input id="r-email" type="email" autoComplete="username" value={form.email}
            onChange={set("email")} placeholder="you@company.com" className={field} />
        </div>

        <div>
          <label htmlFor="r-pass" className="mb-1.5 block text-xs font-medium text-slate-700">Password</label>
          <input id="r-pass" type="password" autoComplete="new-password" value={form.password}
            onChange={set("password")} placeholder="at least 6 characters" className={field} />
        </div>

        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        {notice && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">{notice}</p>}

        <button type="submit" disabled={busy}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-sm
                     transition hover:bg-indigo-700 disabled:opacity-60">
          {busy ? "Creating…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
