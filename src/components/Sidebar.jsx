import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

export default function Sidebar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 flex flex-col">
      <h2 className="text-xl mb-6 font-bold">PerfTrack AI</h2>

      {/* Employee links */}
      {role === "EMPLOYEE" && (
        <>
          <Link to="/employee" className="block mb-3 hover:text-blue-400">
            📊 Dashboard
          </Link>
          <Link to="/tasks" className="block mb-3 hover:text-blue-400">
            ✅ My Tasks
          </Link>
        </>
      )}

      {/* Admin links */}
      {role === "ADMIN" && (
  <>
    <Link to="/admin" className="block mb-3 hover:text-blue-400">
      📊 Admin Dashboard
    </Link>
    <Link to="/assign" className="block mb-3 hover:text-blue-400">
      📝 Assign Task
    </Link>
    <Link to="/review" className="block mb-3 hover:text-blue-400">
      🔍 Review Tasks
    </Link>
  </>
)}

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded w-full transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}