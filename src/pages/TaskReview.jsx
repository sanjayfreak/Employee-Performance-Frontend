import { useEffect, useState } from "react";
import api, { apiMessage } from "../services/api";
import Shell from "../components/Shell";
import { formatDate } from "../theme";

const RATING_LABELS = {
  1: "Poor",
  2: "Below par",
  3: "Acceptable",
  4: "Good",
  5: "Excellent",
};

/** 1-5 picker. Quality is 30% of the score, so approval requires one. */
function RatingPicker({ value, onChange }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#7d848f]">
        Quality rating <span className="text-red-300">*</span>
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={value === n}
            title={RATING_LABELS[n]}
            className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
              value === n
                ? "border-[#2a2e35] bg-[#131519] font-medium text-[#f5f6f7]"
                : "border border-[#1d2025] text-[#7d848f] hover:border-[#2a2e35] hover:text-[#f5f6f7]"
            }`}
          >
            {n}
          </button>
        ))}
        <span className="ml-1 text-xs text-[#7d848f]">
          {value ? RATING_LABELS[value] : "Pick a score to enable approval"}
        </span>
      </div>
    </div>
  );
}

export default function TaskReview() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [rejectFor, setRejectFor] = useState(null);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    api
      .get("/tasks/submitted")
      .then((res) => setTasks(res.data || []))
      .catch((err) =>
        setBanner({ tone: "err", text: apiMessage(err, "Couldn't load submitted tasks.") })
      )
      .finally(() => setLoading(false));
  }, []);

  const approve = async (id) => {
    const qualityRating = ratings[id];
    if (!qualityRating) {
      setBanner({ tone: "err", text: "Give the work a quality rating first." });
      return;
    }
    setBusy(true);
    try {
      await api.post(`/tasks/${id}/approve`, { qualityRating });
      setTasks((p) => p.filter((t) => t.id !== id));
      setBanner({ tone: "ok", text: `Task approved and rated ${qualityRating}/5.` });
    } catch (err) {
      setBanner({ tone: "err", text: apiMessage(err, "Couldn't approve that task.") });
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
    } catch (err) {
      setBanner({ tone: "err", text: apiMessage(err, "Couldn't reject that task.") });
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
        <div
          role="alert"
          className={`flex items-start gap-2 rounded-lg px-4 py-3 text-sm ${
            banner.tone === "ok"
              ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
              : "border border-amber-500/25 bg-amber-500/10 text-amber-200"
          }`}
        >
          <span className="flex-1">{banner.text}</span>
          <button onClick={() => setBanner(null)} aria-label="Dismiss" className="opacity-70 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-[10px] bg-[#0e1013]" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="card px-6 py-16 text-center">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-emerald-500/10 text-emerald-300">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10.5l3.5 3.5L16 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="mt-3 text-sm font-medium text-[#f5f6f7]">Nothing to review</p>
          <p className="mt-1 text-xs text-[#7d848f]">Every submitted task has been handled.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <article key={task.id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-[#f5f6f7]">{task.name}</h2>
                  {task.description && (
                    <p className="mt-0.5 text-xs text-[#7d848f]">{task.description}</p>
                  )}
                </div>
                <span className="rounded-full bg-[#131519] px-2.5 py-1 text-xs font-medium text-[#c3c8cf] ring-1 ring-inset ring-[#1d2025]">
                  Awaiting review
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#7d848f]">
                {task.dueDate && <span>Due {formatDate(task.dueDate)}</span>}
                <span className="font-mono">Employee {task.assignedTo}</span>
              </div>

              <div className="mt-4 rounded-lg border border-white/[0.06] bg-[#0b0c0f] p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#7d848f]">
                  Proof of work
                </p>

                {task.proofLink && (
                  <a
                    href={task.proofLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex max-w-full items-center gap-1.5 text-sm text-[#c3c8cf] hover:text-[#f5f6f7]"
                  >
                    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path
                        d="M8.5 11.5a3 3 0 004.2 0l2.6-2.6a3 3 0 10-4.2-4.2l-.9.9M11.5 8.5a3 3 0 00-4.2 0l-2.6 2.6a3 3 0 104.2 4.2l.9-.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="truncate">{task.proofLink}</span>
                  </a>
                )}

                {task.proofDescription && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#9aa1ab]">
                    {task.proofDescription}
                  </p>
                )}
              </div>

              <div className="mt-5">
                <RatingPicker
                  value={ratings[task.id]}
                  onChange={(n) => setRatings((r) => ({ ...r, [task.id]: n }))}
                />
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => approve(task.id)}
                  disabled={busy || !ratings[task.id]}
                  className="rounded-lg bg-[#4ade80] px-4 py-2 text-sm font-semibold text-[#08090b] transition hover:bg-[#6ee7a0] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    setRejectFor(rejectFor === task.id ? null : task.id);
                    setComment("");
                    setBanner(null);
                  }}
                  className="btn-ghost"
                >
                  Send back
                </button>
              </div>

              {rejectFor === task.id && (
                <form onSubmit={reject} className="mt-4 rounded-lg border border-red-500/25 bg-red-500/10 p-4">
                  <label htmlFor={`c-${task.id}`} className="block text-xs font-medium text-red-200">
                    What needs fixing?
                  </label>
                  <p className="mt-0.5 text-[11px] text-red-300">
                    The employee keeps their submitted proof and sees this comment.
                  </p>
                  <textarea
                    id={`c-${task.id}`}
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Be specific — it's the only feedback they get."
                    className="field mt-2 resize-none"
                  />
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRejectFor(null);
                        setComment("");
                      }}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-[#7d848f] transition hover:bg-[#0e1013] hover:text-[#f5f6f7]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={busy}
                      className="rounded-lg bg-[#f0656f] px-3.5 py-1.5 text-sm font-medium text-[#f5f6f7] transition hover:bg-[#f68d95] disabled:opacity-60"
                    >
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
