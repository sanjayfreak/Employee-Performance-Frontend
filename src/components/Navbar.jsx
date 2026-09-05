import { getUser } from "../services/auth";

export default function Navbar() {
  const user = getUser();

  return (
    <div className="flex items-center justify-between border-b border-white/[0.07] bg-[#0E1524]/80 px-4 py-3.5 backdrop-blur-xl">
      <h1 className="text-sm font-semibold tracking-tight text-white">
        AI Employee Performance Monitoring
      </h1>
      <span className="text-xs text-slate-400">{user?.email}</span>
    </div>
  );
}
