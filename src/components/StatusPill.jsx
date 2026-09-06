import { statusOf } from "../theme";

export default function StatusPill({ status }) {
  const s = statusOf(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.06em]"
      style={{ background: s.soft, color: s.ink, borderColor: s.soft }}
    >
      <span className="h-[5px] w-[5px] rounded-full" style={{ background: s.color }} aria-hidden="true" />
      {s.label}
    </span>
  );
}
