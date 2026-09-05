import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { apiMessage } from "../services/api";
import AuthShell from "../components/AuthShell";

const field = "field";

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
      setError(apiMessage(err, "Could not register. Try again."));
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
          <Link to="/" className="font-medium text-violet-300 hover:text-violet-200">Sign in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <span className="mb-1.5 block text-xs font-medium text-slate-300">Register as</span>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-white/[0.05] p-1 ring-1 ring-inset ring-white/10" role="group">
            {ROLES.map((r) => (
              <button key={r.key} type="button"
                onClick={() => setForm({ ...form, role: r.key })}
                aria-pressed={form.role === r.key}
                className={`rounded-md py-2 text-sm font-medium transition ${
                  form.role === r.key
                    ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-[0_8px_20px_-10px_rgba(124,92,255,.9)]"
                    : "text-slate-400 hover:text-white"
                }`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="r-name" className="mb-1.5 block text-xs font-medium text-slate-300">Full name</label>
          <input id="r-name" value={form.name} onChange={set("name")} placeholder="Sanjay Kumar" className={field} />
        </div>

        <div>
          <label htmlFor="r-email" className="mb-1.5 block text-xs font-medium text-slate-300">Email</label>
          <input id="r-email" type="email" autoComplete="username" value={form.email}
            onChange={set("email")} placeholder="you@company.com" className={field} />
        </div>

        <div>
          <label htmlFor="r-pass" className="mb-1.5 block text-xs font-medium text-slate-300">Password</label>
          <input id="r-pass" type="password" autoComplete="new-password" value={form.password}
            onChange={set("password")} placeholder="at least 6 characters" className={field} />
        </div>

        {error && <p role="alert" className="rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
        {notice && <p role="status" className="rounded-xl bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">{notice}</p>}

        <button type="submit" disabled={busy}
          className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 py-2.5 text-sm font-medium text-white shadow-sm
                     shadow-[0_10px_26px_-12px_rgba(124,92,255,.9)] transition hover:from-violet-400 hover:to-indigo-400 disabled:opacity-60">
          {busy ? "Creating…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
