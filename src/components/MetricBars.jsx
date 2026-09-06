import { SERIES, pct } from "../theme";

const ROWS = [
  { key: "completionRate", label: "Completion", weight: "40%", color: SERIES.completion },
  { key: "onTimeRate",     label: "On time",    weight: "30%", color: SERIES.onTime },
  { key: "qualityScore",   label: "Quality",    weight: "30%", color: SERIES.quality },
];

/** The three inputs the score is computed from, with their weights. */
export default function MetricBars({ log }) {
  return (
    <div className="space-y-3.5">
      {ROWS.map((r) => {
        const v = Math.max(0, Math.min(100, Number(log?.[r.key]) || 0));
        return (
          <div key={r.key}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-[12px] text-[#9aa1ab]">
                {r.label}
                <span className="ml-1.5 text-[11px] text-[#4b515a]">{r.weight}</span>
              </span>
              <span className="font-mono text-[12px] text-[#f5f6f7]">{pct(v)}</span>
            </div>
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-[#17191d]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${v}%`, background: r.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
