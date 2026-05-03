import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AssignTask() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    status: "PENDING",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/admin/employees")
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAssign = async () => {
    setMessage("");
    try {
      await api.post("/tasks/assign", form);
      setMessage("✅ Task assigned successfully!");
      setForm({ name: "", description: "", assignedTo: "", dueDate: "", status: "PENDING" });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to assign task.");
    }
  };

  return (
    <div className="flex">
      <Sidebar role="ADMIN" />
      <div className="flex-1 bg-black text-white min-h-screen">
        <Navbar />
        <div className="p-6 max-w-xl">
          <h1 className="text-xl font-bold mb-6">Assign Task</h1>

          {message && <p className="mb-4 text-sm">{message}</p>}

          <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-sm">Task Name</label>
              <input
                className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Task name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-sm">Description</label>
              <textarea
                className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                placeholder="Task description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-sm">Assign To</label>
              <select
                className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-sm">Due Date</label>
              <input
                type="date"
                className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>

            <button
              onClick={handleAssign}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition"
            >
              Assign Task
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}