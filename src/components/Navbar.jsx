import { getUser } from "../services/auth";

export default function Navbar() {
  const user = getUser();
  return (
    <div className="flex items-center justify-between border-b border-[#17191d] px-5 py-3.5">
      <h1 className="text-sm font-semibold tracking-[-0.01em] text-[#f5f6f7]">
        Employee Performance Monitoring
      </h1>
      <span className="font-mono text-[11px] text-[#5a616b]">{user?.email}</span>
    </div>
  );
}
