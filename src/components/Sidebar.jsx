import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout, getUser } from "../services/auth";

const Icon = ({ d }) => (
  <svg viewBox="0 0 20 20" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NAV = {
  EMPLOYEE: [
    { to: "/employee", label: "Dashboard", d: "M3 10.5L10 4l7 6.5M5 9.5V16h10V9.5" },
    { to: "/tasks", label: "My tasks", d: "M4 10.5l2.5 2.5L11 8M4 5h12M4 15h7" },
  ],
  ADMIN: [
    { to: "/admin", label: "Dashboard", d: "M3 10.5L10 4l7 6.5M5 9.5V16h10V9.5" },
    { to: "/assign", label: "Assign task", d: "M10 4.5v11M4.5 10h11" },
    { to: "/review", label: "Review proofs", d: "M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM13.5 13.5L17 17" },
  ],
};

export default function Sidebar({ role, open, onClose }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = getUser();
  const items = NAV[role] || [];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/70 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[208px] flex-col border-r border-[#17191d] bg-[#08090b]
          transition-transform duration-200 lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-2.5 px-5 py-6">
          <div className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-[#e8eaed]">
            <svg viewBox="0 0 20 20" className="h-[15px] w-[15px]" fill="none" stroke="#08090b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 14l3.5-4 3 2.5L16 5" />
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-semibold leading-tight tracking-[-0.01em] text-[#f5f6f7]">PerfTrack</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#4b515a]">
              {role === "ADMIN" ? "Admin" : "Employee"}
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-0.5 px-3">
          <p className="label px-2.5 pb-2 pt-2">Menu</p>
          {items.map((it) => {
            const active = pathname === it.to;
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-2.5 rounded-[7px] px-2.5 py-2 text-[13px] transition
                  ${active
                    ? "bg-[#131519] font-medium text-[#f5f6f7]"
                    : "text-[#6b7280] hover:bg-[#0e1013] hover:text-[#c3c8cf]"}`}
              >
                <span className={active ? "text-[#e8eaed]" : "text-[#4b515a] group-hover:text-[#8b929c]"}>
                  <Icon d={it.d} />
                </span>
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-grow" />

        <div className="border-t border-[#17191d] px-3 py-3">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full bg-[#1d2025] text-[11px] font-semibold text-[#9aa1ab]">
              {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-[#e8eaed]">{user?.name || "Signed in"}</p>
              <p className="truncate text-[11px] text-[#4b515a]">{user?.email || role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2.5 rounded-[7px] px-2.5 py-2 text-left text-[13px] text-[#6b7280] transition hover:bg-[#0e1013] hover:text-[#c3c8cf]"
          >
            <svg viewBox="0 0 20 20" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6V4.5A1.5 1.5 0 0010.5 3h-5A1.5 1.5 0 004 4.5v11A1.5 1.5 0 005.5 17h5a1.5 1.5 0 001.5-1.5V14M8 10h9m0 0l-2.5-2.5M17 10l-2.5 2.5" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
