import { band } from "../theme";

const R = 54;
const C = 2 * Math.PI * R;

/** Hero gauge for the overall performance score. */
export default function ScoreRing({ score = 0, size = 160 }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  const b = band(value);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="absolute inset-6 rounded-full blur-2xl"
        style={{ background: b.soft }}
        aria-hidden="true"
      />
      <svg viewBox="0 0 140 140" className="relative h-full w-full -rotate-90">
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={b.color} />
            <stop offset="100%" stopColor={b.ink} />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="13" />
        <circle
          cx="70" cy="70" r={R}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * C} ${C}`}
          style={{
            transition: "stroke-dasharray 700ms cubic-bezier(.22,1,.36,1)",
            filter: `drop-shadow(0 0 6px ${b.color}66)`,
          }}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-[34px] font-semibold leading-none tabular-nums text-white">
            {Math.round(value)}
          </div>
          <div className="mt-1.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: b.ink }}>
            {b.label}
          </div>
        </div>
      </div>
    </div>
  );
}
