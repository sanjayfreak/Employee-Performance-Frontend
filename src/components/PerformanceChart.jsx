import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import { SERIES } from "../theme";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0E1524]/95 px-3 py-2 text-xs shadow-2xl backdrop-blur">
      <p className="font-medium text-white">{label}</p>
      <p className="mt-0.5 text-slate-400">
        Score{" "}
        <span className="font-semibold tabular-nums text-violet-300">
          {Math.round(payload[0].value)}
        </span>
      </p>
    </div>
  );
}

/** Score over time. Single series, so the heading names it — no legend needed. */
export default function PerformanceChart({ history }) {
  if (!history?.length) {
    return (
      <div className="grid h-[240px] place-items-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-center">
        <div>
          <p className="text-sm font-medium text-slate-300">No history yet</p>
          <p className="mt-1 text-xs text-slate-500">
            Your score is recorded each time the dashboard loads.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={history} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="score-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES.score} stopOpacity={0.45} />
              <stop offset="100%" stopColor={SERIES.score} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#8A93A6" }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,.08)" }}
            minTickGap={20}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#8A93A6" }}
            tickLine={false}
            axisLine={false}
            width={34}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "rgba(255,255,255,.2)", strokeDasharray: "3 3" }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke={SERIES.score}
            strokeWidth={2.2}
            fill="url(#score-fill)"
            dot={{ r: 3, fill: SERIES.score, strokeWidth: 0 }}
            activeDot={{ r: 5, stroke: "#0E1524", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
