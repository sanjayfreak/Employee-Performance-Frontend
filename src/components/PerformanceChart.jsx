import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import { SERIES } from "../theme";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-slate-900">{label}</p>
      <p className="mt-0.5 text-slate-600">
        Score <span className="font-semibold tabular-nums text-slate-900">
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
      <div className="grid h-[240px] place-items-center rounded-xl bg-slate-50 text-center">
        <div>
          <p className="text-sm font-medium text-slate-700">No history yet</p>
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
        <LineChart data={history} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#eef2f6" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            minTickGap={20}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            width={34}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#cbd5e1", strokeDasharray: "3 3" }} />
          <Line
            type="monotone"
            dataKey="score"
            stroke={SERIES.score}
            strokeWidth={2}
            dot={{ r: 3, fill: SERIES.score, strokeWidth: 0 }}
            activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
