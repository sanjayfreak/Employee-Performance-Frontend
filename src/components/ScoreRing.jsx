import { band } from "../theme";

const R = 54;
const C = 2 * Math.PI * R;

/** Hero gauge. White track by default; hue only when the band warrants it. */
export default function ScoreRing({ score = 0, size = 140 }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  const b = band(value);
  const stroke = value >= 80 ? "#e8eaed" : b.color;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={R} fill="none" stroke="#17191d" strokeWidth="10" />
        <circle
          cx="64" cy="64" r={R}
          fill="none"
          stroke={stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * C} ${C}`}
          style={{ transition: "stroke-dasharray 600ms cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-mono text-[30px] font-medium leading-none tracking-[-0.03em] text-[#f5f6f7]">
            {Math.round(value)}
          </div>
          <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: b.ink }}>
            {b.label}
          </div>
        </div>
      </div>
    </div>
  );
}
