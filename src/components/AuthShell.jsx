export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-full lg:grid-cols-2">
      {/* ---------- brand panel ---------- */}
      <div className="relative hidden overflow-hidden lg:block">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 100% at 0% 0%, #3B1D8F 0%, #1A1440 45%, #070A14 100%)",
          }}
        />
        {/* soft light blooms */}
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-violet-500/30 blur-[90px]" />
        <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-[100px]" />
        {/* grid texture */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(70% 70% at 40% 40%, #000 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(70% 70% at 40% 40%, #000 40%, transparent 100%)",
          }}
        />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-inset ring-white/20 backdrop-blur">
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 14l3.5-4 3 2.5L16 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold">PerfTrack AI</span>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-semibold leading-[1.12] tracking-tight">
              Performance you can{" "}
              <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
                actually explain.
              </span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Every score breaks down into completion, timeliness and quality —
              with AI analysis of what to work on next.
            </p>
            <ul className="mt-9 space-y-3.5 text-sm text-slate-300">
              {[
                "Scores weighted 40% completion, 30% on-time, 30% quality",
                "Proof-of-work review with approve and reject",
                "AI insight and course recommendations per employee",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-500/20 ring-1 ring-inset ring-violet-400/30">
                    <svg viewBox="0 0 20 20" className="h-3 w-3 text-violet-200"
                      fill="none" stroke="currentColor" strokeWidth="2.6">
                      <path d="M4 10.5l3.5 3.5L16 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-slate-500">© {new Date().getFullYear()} PerfTrack AI</p>
        </div>
      </div>

      {/* ---------- form panel ---------- */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm rise">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white">
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 14l3.5-4 3 2.5L16 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-white">PerfTrack AI</span>
          </div>

          <div className="card p-7">
            <h1 className="text-xl font-semibold tracking-tight text-white">{title}</h1>
            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>

          <p className="mt-5 text-center text-sm text-slate-400">{footer}</p>
        </div>
      </div>
    </div>
  );
}
