import { useState } from "react";
import Sidebar from "./Sidebar";

/** Page frame: fixed rail, hairline header, centred content column. */
export default function Shell({ role, title, subtitle, actions, children }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-full bg-[#08090b]">
      <Sidebar role={role} open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="lg:pl-[208px]">
        <header className="sticky top-0 z-20 border-b border-[#17191d] bg-[#08090b]/85 backdrop-blur">
          <div className="flex items-center gap-3 px-5 py-3.5 sm:px-7">
            <button
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
              className="rounded-md p-2 text-[#5a616b] transition hover:bg-[#131519] hover:text-[#e8eaed] lg:hidden"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
              </svg>
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[14px] font-semibold tracking-[-0.01em] text-[#f5f6f7]">{title}</h1>
              {subtitle && <p className="truncate text-[11px] text-[#5a616b]">{subtitle}</p>}
            </div>

            {actions}
          </div>
        </header>

        <main className="rise mx-auto max-w-6xl space-y-4 px-5 py-6 sm:px-7">{children}</main>
      </div>
    </div>
  );
}
