import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getUser } from "../services/auth";
import Shell from "../components/Shell";
import Card from "../components/Card";
import ScoreRing from "../components/ScoreRing";
import MetricBars from "../components/MetricBars";
import PerformanceChart from "../components/PerformanceChart";
import StatusPill from "../components/StatusPill";
import { STATUS_ORDER, band, trendOf, formatDate } from "../theme";

const Icon = ({ d }) => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WARNING_TONE = {
  1: { soft: "rgba(245,179,60,.15)", ink: "#F8CC7A", label: "Level 1" },
  2: { soft: "rgba(251,146,60,.15)", ink: "#FDBE8A", label: "Level 2" },
  3: { soft: "rgba(248,113,113,.15)", ink: "#FCA5A5", label: "Level 3" },
  4: { soft: "rgba(248,113,113,.15)", ink: "#FCA5A5", label: "Level 4" },
};

export default function EmployeeDashboard() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [error, setError] = useState("");
  const user = getUser();

  useEffect(() => {
    const userId = user?.userId;
    if (!userId) return;

    api.get(`/performance/dashboard/${userId}`)
      .then((res) => setData(res.data))
      .catch(() => setError("Couldn't load your dashboard. The server may still be waking up."));

    api.get(`/performance/history/${userId}`)
      .then((res) =>
        setHistory(
          (res.data || []).map((item) => ({
            ...item,
            date: new Date(item.createdAt).toLocaleDateString(undefined, {
              day: "numeric", month: "short",
            }),
          }))
        )
      )
      .catch(() => {});

    api.get(`/warnings/${userId}`)
      .then((res) => setWarnings(res.data || []))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tasks = data?.tasks || [];
  const counts = STATUS_ORDER.reduce((acc, k) => {
    acc[k] = tasks.filter((t) => t.status === k).length;
    return acc;
  }, {});
  const open = (counts.PENDING || 0) + (counts.IN_PROGRESS || 0);
  const latest = history.length ? history[history.length - 1] : null;
  const score = Number(data?.score) || 0;
  const b = band(score);
  const tr = trendOf(data?.trend);
  const latestWarning = warnings.find((w) => !w.resolved) || null;

  return (
    <Shell
      role="EMPLOYEE"
      title={user?.name ? `Hello, ${user.name}` : "Dashboard"}
      subtitle="Your performance at a glance"
      actions={
        <Link
          to="/tasks"
          className="btn-primary ml-auto"
        >
          My tasks
        </Link>
      }
    >
      {error && (
        <div role="alert" className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {error}
        </div>
      )}

      {!data && !error ? (
        <div className="grid gap-5">
          <div className="h-32 animate-pulse rounded-[10px] bg-[#0e1013]" />
          <div className="h-64 animate-pulse rounded-[10px] bg-[#0e1013]" />
        </div>
      ) : (
        <>
          {latestWarning && (
            <div
              className="flex items-start gap-3 rounded-lg px-4 py-3 text-sm"
              style={{ background: (WARNING_TONE[latestWarning.level] || WARNING_TONE[1]).soft,
                       color: (WARNING_TONE[latestWarning.level] || WARNING_TONE[1]).ink }}
            >
              <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M10 7v4M10 13.5v.5M10 2.5L2.5 16h15L10 2.5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <span className="font-semibold">
                  Performance warning · {(WARNING_TONE[latestWarning.level] || WARNING_TONE[1]).label}
                </span>
                <p className="mt-0.5">{latestWarning.message}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <Card
              title="Performance score"
              value={`${Math.round(score)}%`}
              hint={b.label}
              accent={{ soft: b.soft, ink: b.ink }}
              icon={<Icon d="M3 14l3.5-4 3 2.5L16 5" />}
            />
            <Card
              title="Trend"
              value={tr.label}
              numeric={false}
              accent={{ soft: tr.soft, ink: tr.ink }}
              icon={<Icon d={tr.arrow} />}
            />
            <Card
              title="Open tasks"
              value={open}
              hint={`${tasks.length} assigned in total`}
              accent={{ soft: "rgba(76,154,255,.16)", ink: "#96C4FF" }}
              icon={<Icon d="M4 5h12M4 10h12M4 15h8" />}
            />
            <Card
              title="Approved"
              value={counts.COMPLETED || 0}
              hint={counts.SUBMITTED ? `${counts.SUBMITTED} awaiting review` : undefined}
              accent={{ soft: "rgba(52,211,153,.15)", ink: "#7BE7BE" }}
              icon={<Icon d="M4 10.5l3.5 3.5L16 6" />}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <section className="card p-6">
              <h2 className="text-sm font-semibold text-[#f5f6f7]">Score breakdown</h2>
              <p className="mt-0.5 text-xs text-[#7d848f]">How your overall number is made up</p>

              <div className="mt-5 flex justify-center">
                <ScoreRing score={score} />
              </div>

              <div className="mt-6 border-t border-[#17191d] pt-5">
                <MetricBars log={latest} />
              </div>
            </section>

            <section className="card p-6 lg:col-span-2">
              <h2 className="text-sm font-semibold text-[#f5f6f7]">Score over time</h2>
              <p className="mt-0.5 text-xs text-[#7d848f]">
                A point is recorded when a task is assigned, approved or sent back
              </p>
              <div className="mt-4">
                <PerformanceChart history={history} />
              </div>
            </section>
          </div>

          <section className="card p-6">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#131519] text-[#c3c8cf]">
                <Icon d="M10 3.5l1.6 3.6 3.9.4-2.9 2.6.8 3.9L10 12l-3.4 2 .8-3.9L4.5 7.5l3.9-.4L10 3.5z" />
              </span>
              <h2 className="text-sm font-semibold text-[#f5f6f7]">AI analysis</h2>
            </div>

            {data?.aiInsight?.insight ? (
              <>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#9aa1ab]">
                  {data.aiInsight.insight}
                </p>
                {data.aiInsight.course && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-[#131519] px-4 py-3">
                    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-[#c3c8cf]"
                      fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 5.5h6a2 2 0 012 2V16a2 2 0 00-2-2H3V5.5zM17 5.5h-6a2 2 0 00-2 2V16a2 2 0 012-2h6V5.5z"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>
                      <p className="text-xs font-medium text-[#c3c8cf]">Suggested next step</p>
                      <p className="text-sm text-[#c3c8cf]">{data.aiInsight.course}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="mt-3 text-sm text-[#7d848f]">
                No analysis yet — complete a few tasks and it will appear here.
              </p>
            )}
          </section>

          <section className="card">
            <div className="flex items-center justify-between border-b border-[#17191d] px-5 py-4">
              <h2 className="text-sm font-semibold text-[#f5f6f7]">Assigned tasks</h2>
              <Link to="/tasks" className="text-xs font-medium text-[#c3c8cf] hover:text-[#f5f6f7]">
                View all →
              </Link>
            </div>

            {tasks.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-[#7d848f]">Nothing assigned yet.</p>
            ) : (
              <ul className="divide-y divide-[#141619]">
                {tasks.slice(0, 5).map((t) => (
                  <li key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#f5f6f7]">{t.name}</p>
                      {t.dueDate && (
                        <p className="mt-0.5 text-xs text-[#7d848f]">Due {formatDate(t.dueDate)}</p>
                      )}
                    </div>
                    <StatusPill status={t.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </Shell>
  );
}
