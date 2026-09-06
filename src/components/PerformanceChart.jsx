import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import { SERIES } from "../theme";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#23262b] bg-[#0b0c0f] px-3 py-2 shadow-xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#5a616b]">{label}</p>
      <p className="mt-1 font-mono text-[15px] text-[#f5f6f7]">{Math.round(payload[0].value)}</p>
    </div>
  );
}

/** Score over time. One white series — no legend needed. */
export default function PerformanceChart({ history }) {
  if (!history?.length) {
    return (
      <div className="grid h-[220px] place-items-center rounded-lg border border-dashed border-[#17191d] text-center">
        <div>
          <p className="text-[13px] text-[#9aa1ab]">No history yet</p>
          <p className="mt-1 text-[11px] text-[#5a616b]">
            A point is recorded when a task is assigned, approved or sent back.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={history} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="score-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES.score} stopOpacity={0.10} />
              <stop offset="100%" stopColor={SERIES.score} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#141619" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#4b515a", fontFamily: "JetBrains Mono, monospace" }}
            tickLine={false}
            axisLine={{ stroke: "#17191d" }}
            minTickGap={24}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#4b515a", fontFamily: "JetBrains Mono, monospace" }}
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#2a2e35", strokeDasharray: "3 3" }} />
          <Area
            type="monotone"
            dataKey="score"
            stroke={SERIES.score}
            strokeWidth={1.6}
            fill="url(#score-fill)"
            dot={{ r: 2.5, fill: SERIES.score, strokeWidth: 0 }}
            activeDot={{ r: 4, fill: "#f5f6f7", stroke: "#08090b", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
