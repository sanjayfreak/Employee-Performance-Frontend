import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Shell from "../components/Shell";
import Card from "../components/Card";
import { band, pct } from "../theme";

const Icon = ({ d }) => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/employees")
      .then((res) => setEmployees(res.data || []))
      .catch(() => setError("Couldn't load employees. The server may still be waking up."))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    if (!employees.length) return { avg: 0, atRisk: 0, good: 0 };
    const total = employees.reduce((s, e) => s + (Number(e.score) || 0), 0);
    return {
      avg: total / employees.length,
      atRisk: employees.filter((e) => (Number(e.score) || 0) < 70).length,
      good: employees.filter((e) => (Number(e.score) || 0) >= 80).length,
    };
  }, [employees]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...employees].sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
    if (!q) return sorted;
    return sorted.filter((e) =>
      [e.name, e.email].filter(Boolean).some((v) => v.toLowerCase().includes(q))
    );
  }, [employees, query]);

  return (
    <Shell
      role="ADMIN"
      title="Team overview"
      subtitle="Performance across every employee"
      actions={
        <Link to="/assign"
          className="ml-auto rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700">
          Assign task
        </Link>
      }
    >
      {error && (
        <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Card title="Employees" value={employees.length}
          accent={{ soft: "#eef2ff", ink: "#4338ca" }}
          icon={<Icon d="M7 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM3 16c0-2.2 1.8-4 4-4s4 1.8 4 4M13.5 12c1.9 0 3.5 1.6 3.5 3.5M13 9a2 2 0 100-4" />} />
        <Card title="Team average" value={pct(stats.avg)}
          hint={band(stats.avg).label}
          accent={{ soft: band(stats.avg).soft, ink: band(stats.avg).ink }}
          icon={<Icon d="M3 14l3.5-4 3 2.5L16 5" />} />
        <Card title="Performing well" value={stats.good} hint="80% and above"
          accent={{ soft: "#e0f0e0", ink: "#005400" }}
          icon={<Icon d="M4 10.5l3.5 3.5L16 6" />} />
        <Card title="Need attention" value={stats.atRisk} hint="below 70%"
          accent={{ soft: "#fbe6e6", ink: "#a12525" }}
          icon={<Icon d="M10 7v4M10 13.5v.5M10 2.5L2.5 16h15L10 2.5z" />} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Employees</h2>
          <div className="relative w-full max-w-xs">
            <svg viewBox="0 0 20 20"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="9" r="5.5" /><path d="M13.5 13.5L17 17" strokeLinecap="round" />
            </svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email" aria-label="Search employees"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm
                         placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none
                         focus:ring-2 focus:ring-indigo-500/20" />
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}
          </div>
        ) : visible.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-slate-500">
            {employees.length === 0 ? "No employees registered yet." : "No one matches that search."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                  <th className="px-5 py-3 font-medium">Employee</th>
                  <th className="px-5 py-3 font-medium">Score</th>
                  <th className="w-40 px-5 py-3 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((emp) => {
                  const s = Number(emp.score) || 0;
                  const b = band(s);
                  return (
                    <tr key={emp.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                            {(emp.name || "?").charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900">{emp.name}</p>
                            <p className="truncate text-xs text-slate-500">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full"
                              style={{ width: `${Math.min(100, s)}%`, background: b.color }} />
                          </div>
                          <span className="tabular-nums font-medium text-slate-900">{pct(s)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                          style={{ background: b.soft, color: b.ink }}>
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: b.color }} aria-hidden="true" />
                          {b.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Shell>
  );
}
