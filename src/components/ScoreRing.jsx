import { band } from "../theme";

const R = 54;
const C = 2 * Math.PI * R;

/** Hero gauge for the overall performance score. */
export default function ScoreRing({ score = 0, size = 148 }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  const b = band(value);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={R} fill="none" stroke="#eef2f6" strokeWidth="14" />
        <circle
          cx="70" cy="70" r={R}
          fill="none"
          stroke={b.color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * C} ${C}`}
          style={{ transition: "stroke-dasharray 600ms ease" }}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-3xl font-semibold tabular-nums text-slate-900">
            {Math.round(value)}
          </div>
          <div className="text-[11px] font-medium" style={{ color: b.ink }}>{b.label}</div>
        </div>
      </div>
    </div>
  );
}
