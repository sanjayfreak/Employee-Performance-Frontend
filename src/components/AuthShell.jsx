/**
 * Split auth screen.
 *
 * The left panel deliberately shows a real fragment of the product rather
 * than a marketing bullet list — the same score card the dashboard renders,
 * built from the same tokens, so there is no separate visual to maintain.
 */

const STEPS = [
  "Admin assigns a task with a due date",
  "Employee submits a link and a summary",
  "Admin approves with a 1–5 quality rating",
  "The score updates, and only then",
];

function ScorePanel() {
  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between">
        <span className="label">Composite</span>
        <span className="font-mono text-[10px] text-[#5a616b]">weighted</span>
      </div>

      <div className="mt-2.5 flex items-end gap-2.5">
        <span className="font-mono text-[40px] font-medium leading-none tracking-[-0.04em] text-[#f5f6f7]">78.4</span>
        <span className="pb-1.5 font-mono text-[12px] text-[#4ade80]">+4.1</span>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        {[
          { label: "Completion", weight: "40%", value: 82, tone: "#e8eaed" },
          { label: "On time", weight: "30%", value: 64, tone: "#8b929c" },
          { label: "Quality", weight: "30%", value: 80, tone: "#8b929c" },
        ].map((row) => (
          <div key={row.label}>
            <div className="mb-1.5 flex justify-between">
              <span className="text-[11px] text-[#7d848f]">
                {row.label} <span className="text-[#4b515a]">{row.weight}</span>
              </span>
              <span className="font-mono text-[11px] text-[#c3c8cf]">{row.value}</span>
            </div>
            <div className="h-[3px] rounded-full bg-[#17191d]">
              <div className="h-full rounded-full" style={{ width: `${row.value}%`, background: row.tone }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowPanel() {
  return (
    <div className="flex flex-col gap-px overflow-hidden rounded-[10px] border border-[#17191d] bg-[#17191d]">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-3.5 bg-[#0b0c0f] px-4 py-3.5">
          <span className="w-4 shrink-0 font-mono text-[11px] text-[#4b515a]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className={`text-[13px] ${i === STEPS.length - 1 ? "text-[#e8eaed]" : "text-[#c3c8cf]"}`}>
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AuthShell({ title, subtitle, children, footer, variant = "signin" }) {
  const register = variant === "register";

  return (
    <div className="grid min-h-full lg:grid-cols-[1fr_520px]">

      {/* ---------- left: quiet proof panel ---------- */}
      <div className="relative hidden overflow-hidden border-r border-[#17191d] p-11 lg:flex lg:flex-col">
        <div className="grid-ground pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative flex items-center gap-2.5">
          <div className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-[#e8eaed]">
            <svg viewBox="0 0 20 20" className="h-[15px] w-[15px]" fill="none" stroke="#08090b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 14l3.5-4 3 2.5L16 5" />
            </svg>
          </div>
          <span className="text-[14px] font-semibold tracking-[-0.01em] text-[#f5f6f7]">PerfTrack</span>
        </div>

        <div className="relative flex max-w-[460px] flex-grow flex-col justify-center">
          <h1 className="text-[38px] font-semibold leading-[1.16] tracking-[-0.03em] text-[#f5f6f7] [text-wrap:pretty]">
            {register ? "Three signals. One number. No mystery." : "Performance you can actually explain."}
          </h1>
          <p className="mt-4 text-[14px] leading-[1.7] text-[#7d848f]">
            {register
              ? "Proof of work is reviewed and rated by an admin before a task counts as done, so the score reflects what was actually delivered."
              : "Every score breaks down into completion, timeliness and reviewed quality — with the weights shown, so nobody has to guess where a number came from."}
          </p>

          <div className="mt-10">{register ? <FlowPanel /> : <ScorePanel />}</div>
        </div>

        <div className="relative font-mono text-[11px] text-[#4b515a]">
          © {new Date().getFullYear()} PerfTrack
        </div>
      </div>

      {/* ---------- right: the form ---------- */}
      <div className="flex items-center justify-center p-6 sm:p-11">
        <div className="rise flex w-full max-w-[340px] flex-col">

          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-[#e8eaed]">
              <svg viewBox="0 0 20 20" className="h-[15px] w-[15px]" fill="none" stroke="#08090b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 14l3.5-4 3 2.5L16 5" />
              </svg>
            </div>
            <span className="text-[14px] font-semibold text-[#f5f6f7]">PerfTrack</span>
          </div>

          <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#f5f6f7]">{title}</h2>
          <p className="mt-1.5 text-[13px] text-[#6b7280]">{subtitle}</p>

          <div className="mt-7">{children}</div>

          <p className="mt-4 text-center text-[13px] text-[#6b7280]">{footer}</p>
        </div>
      </div>
    </div>
  );
}
