import { statusOf } from "../theme";

export default function StatusPill({ status }) {
  const s = statusOf(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ring-white/10"
      style={{ background: s.soft, color: s.ink }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }}
        aria-hidden="true"
      />
      {s.label}
    </span>
  );
}
