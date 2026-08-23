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
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="text-slate-600">
                {r.label}
                <span className="ml-1.5 text-xs text-slate-400">weight {r.weight}</span>
              </span>
              <span className="font-medium tabular-nums text-slate-900">{pct(v)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
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
