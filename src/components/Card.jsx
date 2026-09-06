/** Stat tile. `accent` supplies {soft, ink} for the status dot. */
export default function Card({ title, value, hint, accent, icon }) {
  const a = accent || { soft: "rgba(139,146,156,.10)", ink: "#9aa1ab" };
  return (
    <div className="card p-4 transition-colors duration-200 hover:border-[#23262b]">
      <div className="flex items-start justify-between gap-2">
        <span className="label">{title}</span>
        {icon && (
          <span className="text-[#4b515a]" aria-hidden="true">{icon}</span>
        )}
      </div>

      <div className="mt-2.5 font-mono text-[26px] font-medium leading-none tracking-[-0.03em] text-[#f5f6f7]">
        {value}
      </div>

      {hint && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="h-[5px] w-[5px] shrink-0 rounded-full" style={{ background: a.ink }} aria-hidden="true" />
          <span className="text-[11px] text-[#6b7280]">{hint}</span>
        </div>
      )}
    </div>
  );
}
