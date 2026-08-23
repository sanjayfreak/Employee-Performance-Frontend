/** Stat tile. `accent` supplies {soft, ink} for the icon chip. */
export default function Card({ title, value, hint, accent, icon }) {
  const a = accent || { soft: "#eef2ff", ink: "#4338ca" };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm text-slate-500">{title}</span>
        {icon && (
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
            style={{ background: a.soft, color: a.ink }}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl font-semibold tabular-nums text-slate-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}
