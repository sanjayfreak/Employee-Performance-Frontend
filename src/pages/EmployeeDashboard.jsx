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
  1: { soft: "#fdf3dc", ink: "#7a5300", label: "Level 1" },
  2: { soft: "#fdeae2", ink: "#8f3f1c", label: "Level 2" },
  3: { soft: "#fbe6e6", ink: "#a12525", label: "Level 3" },
  4: { soft: "#fbe6e6", ink: "#a12525", label: "Level 4" },
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
  const latestWarning = warnings.length ? warnings[warnings.length - 1] : null;

  return (
    <Shell
      role="EMPLOYEE"
      title={user?.name ? `Hello, ${user.name}` : "Dashboard"}
      subtitle="Your performance at a glance"
      actions={
        <Link
          to="/tasks"
          className="ml-auto rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
        >
          My tasks
        </Link>
      }
    >
      {error && (
        <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      )}

      {!data && !error ? (
        <div className="grid gap-5">
          <div className="h-32 animate-pulse rounded-2xl bg-white" />
          <div className="h-64 animate-pulse rounded-2xl bg-white" />
        </div>
      ) : (
        <>
          {latestWarning && (
            <div
              className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm"
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
              accent={{ soft: tr.soft, ink: tr.ink }}
              icon={<Icon d={tr.arrow} />}
            />
            <Card
              title="Open tasks"
              value={open}
              hint={`${tasks.length} assigned in total`}
              accent={{ soft: "#e4eefb", ink: "#1b4d8a" }}
              icon={<Icon d="M4 5h12M4 10h12M4 15h8" />}
            />
            <Card
              title="Approved"
              value={counts.COMPLETED || 0}
              hint={counts.SUBMITTED ? `${counts.SUBMITTED} awaiting review` : undefined}
              accent={{ soft: "#e0f0e0", ink: "#005400" }}
              icon={<Icon d="M4 10.5l3.5 3.5L16 6" />}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">Score breakdown</h2>
              <p className="mt-0.5 text-xs text-slate-500">How your overall number is made up</p>

              <div className="mt-5 flex justify-center">
                <ScoreRing score={score} />
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <MetricBars log={latest} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <h2 className="text-sm font-semibold text-slate-900">Score over time</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Recorded each time your dashboard is calculated
              </p>
              <div className="mt-4">
                <PerformanceChart history={history} />
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-50 text-indigo-700">
                <Icon d="M10 3.5l1.6 3.6 3.9.4-2.9 2.6.8 3.9L10 12l-3.4 2 .8-3.9L4.5 7.5l3.9-.4L10 3.5z" />
              </span>
              <h2 className="text-sm font-semibold text-slate-900">AI analysis</h2>
            </div>

            {data?.aiInsight?.insight ? (
              <>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {data.aiInsight.insight}
                </p>
                {data.aiInsight.course && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-indigo-50 px-4 py-3">
                    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-indigo-700"
                      fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 5.5h6a2 2 0 012 2V16a2 2 0 00-2-2H3V5.5zM17 5.5h-6a2 2 0 00-2 2V16a2 2 0 012-2h6V5.5z"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>
                      <p className="text-xs font-medium text-indigo-900">Suggested next step</p>
                      <p className="text-sm text-indigo-800">{data.aiInsight.course}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                No analysis yet — complete a few tasks and it will appear here.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-900">Assigned tasks</h2>
              <Link to="/tasks" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                View all →
              </Link>
            </div>

            {tasks.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-slate-500">Nothing assigned yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {tasks.slice(0, 5).map((t) => (
                  <li key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{t.name}</p>
                      {t.dueDate && (
                        <p className="mt-0.5 text-xs text-slate-500">Due {formatDate(t.dueDate)}</p>
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
