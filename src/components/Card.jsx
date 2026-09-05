/** Stat tile. `accent` supplies {soft, ink} for the icon chip. */
export default function Card({ title, value, hint, accent, icon }) {
  const a = accent || { soft: "rgba(124,92,255,.16)", ink: "#C4B5FD" };
  return (
    <div className="card group relative overflow-hidden p-5 transition duration-300 hover:border-white/[0.14]">
      {/* accent wash that warms up on hover */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-40 blur-2xl transition duration-500 group-hover:opacity-70"
        style={{ background: a.soft }}
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-2">
        <span className="text-[13px] font-medium text-slate-400">{title}</span>
        {icon && (
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ring-inset ring-white/10"
            style={{ background: a.soft, color: a.ink }}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>
      <div className="relative mt-3 text-[26px] font-semibold leading-none tracking-tight tabular-nums text-white">
        {value}
      </div>
      {hint && <div className="relative mt-2 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}
