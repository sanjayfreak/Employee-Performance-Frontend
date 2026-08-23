import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout, getUser } from "../services/auth";

const Icon = ({ d }) => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NAV = {
  EMPLOYEE: [
    { to: "/employee", label: "Dashboard", d: "M3 10.5L10 4l7 6.5M5 9.5V16h10V9.5" },
    { to: "/tasks", label: "My Tasks", d: "M4 10.5l2.5 2.5L11 8M4 5h12M4 15h7" },
  ],
  ADMIN: [
    { to: "/admin", label: "Dashboard", d: "M3 10.5L10 4l7 6.5M5 9.5V16h10V9.5" },
    { to: "/assign", label: "Assign Task", d: "M10 4.5v11M4.5 10h11" },
    { to: "/review", label: "Review Proofs", d: "M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM13.5 13.5L17 17" },
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
        <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-300
          transition-transform duration-200 lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-2.5 px-5 py-6">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
              <path d="M3 14l3.5-4 3 2.5L16 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="text-[15px] font-semibold leading-tight text-white">
              Perf<span className="text-indigo-400">Track</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">
              {role === "ADMIN" ? "Admin" : "Employee"}
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          <p className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Menu
          </p>
          {items.map((it) => {
            const active = pathname === it.to;
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition
                  ${active
                    ? "bg-indigo-600 font-medium text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
              >
                <span className={active ? "text-white" : "text-slate-400"}>
                  <Icon d={it.d} />
                </span>
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-700 text-sm font-semibold text-white">
              {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.name || "Signed in"}</p>
              <p className="truncate text-xs text-slate-500">{user?.email || role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
