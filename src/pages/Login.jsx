import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { apiMessage } from "../services/api";
import { saveUser } from "../services/auth";
import AuthShell from "../components/AuthShell";

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
      const { token, userId, name, email, role: returnedRole } = res.data;
      saveUser({ token, userId, name, role: returnedRole, email });
      navigate(returnedRole === "ADMIN" ? "/admin" : "/employee");
    } catch (err) {
      setError(apiMessage(err, "Invalid email or password."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      variant="signin"
      title="Sign in"
      subtitle="Choose your role, then enter your details."
      footer={
        <>
          No account?{" "}
          <Link to="/register" className="font-medium text-[#e8eaed] underline decoration-[#2a2e35] underline-offset-4 hover:decoration-[#4b515a]">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-5">

        <div>
          <span className="label block">Sign in as</span>
          <div className="mt-2 grid grid-cols-2 gap-1.5" role="group">
            {ROLES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                aria-pressed={role === r.key}
                className={`rounded-lg border py-2 text-[13px] transition ${
                  role === r.key
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
          <label htmlFor="l-email" className="label block">Email</label>
          <input
            id="l-email" type="email" autoComplete="username"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@company.com" className="field mt-2"
          />
        </div>

        <div>
          <label htmlFor="l-pass" className="label block">Password</label>
          <input
            id="l-pass" type="password" autoComplete="current-password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••" className="field mt-2"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-[#3a2326] bg-[#1a1113] px-3 py-2 text-[12px] text-[#f68d95]">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <div className="flex items-start gap-2 border-t border-[#17191d] pt-4">
          <span className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#f0a35e]" aria-hidden="true" />
          <span className="text-[11px] leading-[1.6] text-[#5a616b]">
            The server sleeps when idle. The first sign-in after a quiet period can take up to a minute.
          </span>
        </div>
      </form>
    </AuthShell>
  );
}
