import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/employees")
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="flex">
      <Sidebar role="ADMIN" />

      <div className="flex-1 bg-black text-white min-h-screen">
        <Navbar />

        <div className="p-6">
          <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>

          {employees.length === 0 ? (
            <p className="opacity-60">No employees found.</p>
          ) : (
            <table className="w-full border border-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Score</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id} className="border-t border-gray-700 hover:bg-gray-800">
                    <td className="p-3">{emp.name}</td>
                    <td className="p-3 opacity-70">{emp.email}</td>
                    <td className="p-3">{emp.score}%</td>
                    <td className="p-3">
                      <span className={
                        emp.score < 50 ? "text-red-500" :
                        emp.score < 70 ? "text-orange-400" :
                        emp.score < 80 ? "text-yellow-400" :
                        "text-green-500"
                      }>
                        {emp.score < 50 ? "Critical" :
                         emp.score < 70 ? "Low" :
                         emp.score < 80 ? "Average" :
                         "Good"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}