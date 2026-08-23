import { useEffect, useState } from "react";
import api from "../services/api";
import Shell from "../components/Shell";
import { formatDate } from "../theme";

export default function TaskReview() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectFor, setRejectFor] = useState(null);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    api.get("/tasks/submitted")
      .then((res) => setTasks(res.data || []))
      .catch(() => setBanner({ tone: "err", text: "Couldn't load submitted tasks." }))
      .finally(() => setLoading(false));
  }, []);

  const approve = async (id) => {
    setBusy(true);
    try {
      await api.post(`/tasks/${id}/approve`);
      setTasks((p) => p.filter((t) => t.id !== id));
      setBanner({ tone: "ok", text: "Task approved." });
    } catch {
      setBanner({ tone: "err", text: "Couldn't approve that task." });
    } finally {
      setBusy(false);
    }
  };

  const reject = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setBanner({ tone: "err", text: "Tell the employee what needs fixing." });
      return;
    }
    setBusy(true);
    try {
      await api.post(`/tasks/${rejectFor}/reject`, { adminComment: comment });
      setTasks((p) => p.filter((t) => t.id !== rejectFor));
      setRejectFor(null);
      setComment("");
      setBanner({ tone: "ok", text: "Sent back to the employee." });
    } catch {
      setBanner({ tone: "err", text: "Couldn't reject that task." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell
      role="ADMIN"
      title="Review proofs"
      subtitle={loading ? "Loading…" : `${tasks.length} awaiting your decision`}
    >
      {banner && (
        <div role="alert"
          className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
            banner.tone === "ok"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border border-amber-200 bg-amber-50 text-amber-900"
          }`}>
          <span className="flex-1">{banner.text}</span>
          <button onClick={() => setBanner(null)} aria-label="Dismiss" className="opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[0, 1].map((i) => <div key={i} className="h-48 animate-pulse rounded-2xl bg-white" />)}
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-emerald-50 text-emerald-700">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10.5l3.5 3.5L16 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="mt-3 text-sm font-medium text-slate-900">Nothing to review</p>
          <p className="mt-1 text-xs text-slate-500">Every submitted task has been handled.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <article key={task.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-slate-900">{task.name}</h2>
                  {task.description && (
                    <p className="mt-0.5 text-xs text-slate-500">{task.description}</p>
                  )}
                </div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-800">
                  Awaiting review
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                {task.dueDate && <span>Due {formatDate(task.dueDate)}</span>}
                <span className="font-mono">Employee {task.assignedTo}</span>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Proof of work</p>

                {task.proofLink && (
                  <a href={task.proofLink} target="_blank" rel="noopener noreferrer"
                    className="mt-2 inline-flex max-w-full items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700">
                    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M8.5 11.5a3 3 0 004.2 0l2.6-2.6a3 3 0 10-4.2-4.2l-.9.9M11.5 8.5a3 3 0 00-4.2 0l-2.6 2.6a3 3 0 104.2 4.2l.9-.9"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="truncate">{task.proofLink}</span>
                  </a>
                )}

                {task.proofDescription && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                    {task.proofDescription}
                  </p>
                )}
              </div>

              <div className="mt-5 flex gap-2">
                <button onClick={() => approve(task.id)} disabled={busy}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60">
                  Approve
                </button>
                <button
                  onClick={() => { setRejectFor(rejectFor === task.id ? null : task.id); setComment(""); setBanner(null); }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  Send back
                </button>
              </div>

              {rejectFor === task.id && (
                <form onSubmit={reject} className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <label htmlFor={`c-${task.id}`} className="block text-xs font-medium text-red-900">
                    What needs fixing?
                  </label>
                  <p className="mt-0.5 text-[11px] text-red-700">
                    The employee sees this, and the task returns to in progress.
                  </p>
                  <textarea id={`c-${task.id}`} rows={3} value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Be specific — it's the only feedback they get."
                    className="mt-2 w-full resize-none rounded-lg border border-red-200 bg-white px-3 py-2 text-sm
                               text-slate-900 placeholder:text-slate-400 focus:border-red-400 focus:outline-none
                               focus:ring-2 focus:ring-red-500/20" />
                  <div className="mt-3 flex justify-end gap-2">
                    <button type="button" onClick={() => { setRejectFor(null); setComment(""); }}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-white">
                      Cancel
                    </button>
                    <button type="submit" disabled={busy}
                      className="rounded-lg bg-red-600 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60">
                      {busy ? "Sending…" : "Send back"}
                    </button>
                  </div>
                </form>
              )}
            </article>
          ))}
        </div>
      )}
    </Shell>
  );
}
