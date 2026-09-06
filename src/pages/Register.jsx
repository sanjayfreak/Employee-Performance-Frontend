import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { apiMessage } from "../services/api";
import AuthShell from "../components/AuthShell";

const ROLES = [
  { key: "EMPLOYEE", label: "Employee" },
  { key: "ADMIN", label: "Admin" },
];

/** Rough strength read-out — guidance only, the backend enforces the minimum. */
function strengthOf(password) {
  if (!password) return { width: 0, label: "", tone: "#17191d" };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { width: 33, label: "weak", tone: "#f0656f" };
  if (score <= 3) return { width: 66, label: "fair", tone: "#c8a45c" };
  return { width: 100, label: "strong", tone: "#4ade80" };
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EMPLOYEE" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const strength = strengthOf(form.password);

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
      variant="register"
      title="Create account"
      subtitle="Register as an employee or an admin."
      footer={
        <>
          Already registered?{" "}
          <Link to="/" className="font-medium text-[#e8eaed] underline decoration-[#2a2e35] underline-offset-4 hover:decoration-[#4b515a]">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <span className="label block">Register as</span>
          <div className="mt-2 grid grid-cols-2 gap-1.5" role="group">
            {ROLES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setForm({ ...form, role: r.key })}
                aria-pressed={form.role === r.key}
                className={`rounded-lg border py-2 text-[13px] transition ${
                  form.role === r.key
                    ? "border-[#2a2e35] bg-[#131519] font-medium text-[#f5f6f7]"
                    : "border-[#17191d] text-[#6b7280] hover:border-[#1d2025] hover:text-[#9aa1ab]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="r-name" className="label block">Full name</label>
          <input id="r-name" value={form.name} onChange={set("name")} placeholder="Sanjay Kumar" className="field mt-2" />
        </div>

        <div>
          <label htmlFor="r-email" className="label block">Email</label>
          <input id="r-email" type="email" autoComplete="username" value={form.email}
            onChange={set("email")} placeholder="you@company.com" className="field mt-2" />
        </div>

        <div>
          <label htmlFor="r-pass" className="label block">Password</label>
          <input id="r-pass" type="password" autoComplete="new-password" value={form.password}
            onChange={set("password")} placeholder="at least 6 characters" className="field mt-2" />

          <div className="mt-2 flex items-center gap-2">
            <div className="h-[2px] flex-grow overflow-hidden rounded-full bg-[#17191d]">
              <div className="h-full transition-all duration-300"
                style={{ width: `${strength.width}%`, background: strength.tone }} />
            </div>
            <span className="font-mono text-[10px] text-[#6b7280]">{strength.label}</span>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-[#3a2326] bg-[#1a1113] px-3 py-2 text-[12px] text-[#f68d95]">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="rounded-lg border border-[#1c3226] bg-[#0d1712] px-3 py-2 text-[12px] text-[#6ee7a0]">
            {notice}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? "Creating…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
