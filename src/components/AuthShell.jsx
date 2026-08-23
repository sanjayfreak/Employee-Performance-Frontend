export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-full lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-slate-900 lg:block">
        <div
          className="absolute inset-0 opacity-90"
          style={{ background: "linear-gradient(135deg,#312e81 0%,#4338ca 45%,#6d28d9 100%)" }}
        />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M3 14l3.5-4 3 2.5L16 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold">PerfTrack AI</span>
          </div>

          <div className="max-w-md">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
              Performance you can actually explain.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-indigo-100">
              Every score breaks down into completion, timeliness and quality —
              with AI analysis of what to work on next.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-indigo-100">
              {[
                "Scores weighted 40% completion, 30% on-time, 30% quality",
                "Proof-of-work review with approve and reject",
                "AI insight and course recommendations per employee",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300"
                    fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M4 10.5l3.5 3.5L16 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-indigo-200/70">© {new Date().getFullYear()} PerfTrack AI</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-slate-100 px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M3 14l3.5-4 3 2.5L16 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-slate-900">PerfTrack AI</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>

          <p className="mt-5 text-center text-sm text-slate-500">{footer}</p>
        </div>
      </div>
    </div>
  );
}
