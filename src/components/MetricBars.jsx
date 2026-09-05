import { SERIES, pct } from "../theme";

const ROWS = [
  { key: "completionRate", label: "Completion", weight: "40%", color: SERIES.completion },
  { key: "onTimeRate",     label: "On time",    weight: "30%", color: SERIES.onTime },
  { key: "qualityScore",   label: "Quality",    weight: "30%", color: SERIES.quality },
];

/**
 * The three inputs the overall score is computed from, with the weight
 * each one carries — so the headline number is explainable.
 */
export default function MetricBars({ log }) {
  return (
    <div className="space-y-4">
      {ROWS.map((r) => {
        const v = Math.max(0, Math.min(100, Number(log?.[r.key]) || 0));
        return (
          <div key={r.key}>
            <div className="mb-2 flex items-baseline justify-between text-sm">
              <span className="text-slate-400">
                {r.label}
                <span className="ml-1.5 text-[11px] text-slate-600">weight {r.weight}</span>
              </span>
              <span className="font-semibold tabular-nums text-white">{pct(v)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${v}%`,
                  background: `linear-gradient(90deg, ${r.color}99, ${r.color})`,
                  boxShadow: `0 0 12px ${r.color}55`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
