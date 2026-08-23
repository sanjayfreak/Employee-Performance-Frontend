import { useState } from "react";
import Sidebar from "./Sidebar";

/** Page frame: fixed sidebar, sticky header, centred content column. */
export default function Shell({ role, title, subtitle, actions, children }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-full bg-slate-100">
      <Sidebar role={role} open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
            <button
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-semibold tracking-tight text-slate-900">{title}</h1>
              {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
            </div>
            {actions}
          </div>
        </header>

        <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
