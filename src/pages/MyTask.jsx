import { useEffect, useState } from "react";
import api, { apiMessage } from "../services/api";
import { getUser } from "../services/auth";
import Shell from "../components/Shell";
import StatusPill from "../components/StatusPill";
import { STATUS_ORDER, statusOf, formatDate, isOverdue } from "../theme";

const field = "field";

export default function MyTask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [proofFor, setProofFor] = useState(null);
  const [proof, setProof] = useState({ proofLink: "", proofDescription: "" });
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState(null); // { tone: 'ok'|'err', text }

  const user = getUser();

  useEffect(() => {
    if (!user?.userId) return;
    api.get(`/tasks/user/${user.userId}`)
      .then((res) => setTasks(res.data || []))
      .catch((err) => setBanner({ tone: "err", text: apiMessage(err, "Couldn't load your tasks.") }))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = async (id) => {
    const before = tasks;
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, status: "IN_PROGRESS" } : t)));
    try {
      await api.post(`/tasks/${id}/start`);
    } catch (err) {
      setTasks(before);
      setBanner({ tone: "err", text: apiMessage(err, "Couldn't start that task.") });
    }
  };

  const openProof = (task) => {
    setProofFor(task.id);
    setProof({ proofLink: task.proofLink || "", proofDescription: task.proofDescription || "" });
    setBanner(null);
  };

  const submitProof = async (e) => {
    e.preventDefault();
    if (!proof.proofLink.trim() || !proof.proofDescription.trim()) {
      setBanner({ tone: "err", text: "Both the link and a description are required." });
      return;
    }
    setBusy(true);
    try {
      await api.post(`/tasks/${proofFor}/submit-proof`, proof);
      setTasks((p) => p.map((t) => (t.id === proofFor ? { ...t, status: "SUBMITTED", ...proof } : t)));
      setProofFor(null);
      setBanner({ tone: "ok", text: "Proof submitted — waiting for admin review." });
    } catch (err) {
      setBanner({ tone: "err", text: apiMessage(err, "Couldn't submit that.") });
    } finally {
      setBusy(false);
    }
  };

  const counts = STATUS_ORDER.reduce((a, k) => {
    a[k] = tasks.filter((t) => t.status === k).length;
    return a;
  }, {});
  const visible = filter === "ALL" ? tasks : tasks.filter((t) => t.status === filter);

  const tabs = [
    { key: "ALL", label: "All", count: tasks.length },
    ...STATUS_ORDER.map((k) => ({ key: k, label: statusOf(k).label, count: counts[k] })),
  ];

  return (
    <Shell role="EMPLOYEE" title="My Tasks" subtitle="Start work, then submit proof for review">
      {banner && (
        <div
          role="alert"
          className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
            banner.tone === "ok"
              ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
              : "border border-amber-500/25 bg-amber-500/10 text-amber-200"
          }`}
        >
          <span className="flex-1">{banner.text}</span>
          <button onClick={() => setBanner(null)} aria-label="Dismiss" className="opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      <section className="card">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.07] px-5 py-4">
          <div className="flex flex-wrap gap-1 rounded-xl bg-white/[0.05] p-1 ring-1 ring-inset ring-white/10">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  filter === t.key ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-[0_8px_20px_-10px_rgba(124,92,255,.9)]" : "text-slate-400 hover:text-white"
                }`}
              >
                {t.label}
                <span className="ml-1.5 tabular-nums opacity-60">{t.count}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-white/[0.06]" />)}
          </div>
        ) : visible.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-slate-400">
            {tasks.length === 0 ? "No tasks assigned yet." : "Nothing in this view."}
          </p>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {visible.map((task) => {
              const late = isOverdue(task.dueDate, task.status);
              return (
                <li key={task.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{task.name}</p>
                      {task.description && (
                        <p className="mt-0.5 text-xs text-slate-400">{task.description}</p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusPill status={task.status} />
                        {task.dueDate && (
                          <span className={`text-[11px] ${late ? "font-medium text-red-400" : "text-slate-400"}`}>
                            {late ? "Overdue · " : "Due "}{formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>

                      {task.adminComment && task.status !== "COMPLETED" && (
                        <div className="mt-3 rounded-xl bg-red-500/10 px-3 py-2">
                          <p className="text-[11px] font-medium text-red-200">Sent back by admin</p>
                          <p className="mt-0.5 text-xs text-red-300">{task.adminComment}</p>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0">
                      {task.status === "PENDING" && (
                        <button onClick={() => start(task.id)}
                          className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-3.5 py-2 text-xs font-medium text-white shadow-[0_10px_26px_-12px_rgba(124,92,255,.9)] transition hover:from-violet-400 hover:to-indigo-400">
                          Start task
                        </button>
                      )}
                      {task.status === "IN_PROGRESS" && (
                        <button onClick={() => openProof(task)}
                          className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-3.5 py-2 text-xs font-medium text-white shadow-[0_10px_26px_-12px_rgba(124,92,255,.9)] transition hover:from-violet-400 hover:to-indigo-400">
                          Submit proof
                        </button>
                      )}
                      {task.status === "COMPLETED" && task.qualityRating > 0 && (
                        <span className="text-xs text-slate-400">Rated {task.qualityRating}/5</span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {proofFor && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm p-4 sm:items-center">
          <div className="absolute inset-0" onClick={() => setProofFor(null)} aria-hidden="true" />
          <div role="dialog" aria-modal="true" aria-label="Submit proof of work"
            className="relative w-full max-w-lg card p-6 shadow-2xl">
            <h2 className="text-base font-semibold text-white">Submit proof of work</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              An admin reviews this and either approves the task or sends it back.
            </p>

            <form onSubmit={submitProof} className="mt-5 space-y-4">
              <div>
                <label htmlFor="p-link" className="mb-1.5 block text-xs font-medium text-slate-300">
                  Repository or PR link
                </label>
                <input id="p-link" value={proof.proofLink}
                  onChange={(e) => setProof({ ...proof, proofLink: e.target.value })}
                  placeholder="https://github.com/you/repo" className={field} />
              </div>
              <div>
                <label htmlFor="p-desc" className="mb-1.5 block text-xs font-medium text-slate-300">
                  What did you do?
                </label>
                <textarea id="p-desc" rows={3} value={proof.proofDescription}
                  onChange={(e) => setProof({ ...proof, proofDescription: e.target.value })}
                  placeholder="Summarise the work so the reviewer doesn't have to guess."
                  className={`${field} resize-none`} />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setProofFor(null)}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/10">
                  Cancel
                </button>
                <button type="submit" disabled={busy}
                  className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-[0_10px_26px_-12px_rgba(124,92,255,.9)] transition hover:from-violet-400 hover:to-indigo-400 disabled:opacity-60">
                  {busy ? "Submitting…" : "Submit for review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Shell>
  );
}
