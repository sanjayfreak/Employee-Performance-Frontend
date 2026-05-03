import { useEffect, useState } from "react";
import api from "../services/api";
import { getUser } from "../services/auth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MyTask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proofForm, setProofForm] = useState({});
  const [showProofModal, setShowProofModal] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = getUser();
    api.get(`/tasks/user/${user.userId}`)
      .then(res => setTasks(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Move PENDING → IN_PROGRESS
  const handleStart = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: "IN_PROGRESS" });
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, status: "IN_PROGRESS" } : t
      ));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Submit proof → SUBMITTED
  const handleSubmitProof = async (taskId) => {
    const proof = proofForm[taskId];
    if (!proof?.proofLink || !proof?.proofDescription) {
      setMessage("Both GitHub link and description are required.");
      return;
    }
    try {
      await api.post(`/tasks/${taskId}/submit-proof`, {
        proofLink: proof.proofLink,
        proofDescription: proof.proofDescription,
      });
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, status: "SUBMITTED" } : t
      ));
      setShowProofModal(null);
      setMessage("✅ Proof submitted! Waiting for admin approval.");
    } catch (err) {
      setMessage("❌ Failed to submit proof.");
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    if (status === "COMPLETED") return "text-green-400";
    if (status === "IN_PROGRESS") return "text-yellow-400";
    if (status === "SUBMITTED") return "text-blue-400";
    return "text-gray-400";
  };

  const getStatusBadge = (status) => {
    if (status === "COMPLETED") return "bg-green-900 text-green-400";
    if (status === "IN_PROGRESS") return "bg-yellow-900 text-yellow-400";
    if (status === "SUBMITTED") return "bg-blue-900 text-blue-400";
    return "bg-gray-800 text-gray-400";
  };

  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="flex">
      <Sidebar role="EMPLOYEE" />
      <div className="flex-1 bg-black text-white min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-xl font-bold mb-6">My Tasks</h1>

          {message && (
            <p className="mb-4 text-sm p-3 bg-gray-800 rounded-lg">{message}</p>
          )}

          {tasks.length === 0 ? (
            <p className="opacity-60">No tasks assigned yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {tasks.map(task => (
                <div key={task.id} className="bg-gray-900 p-4 rounded-xl">

                  {/* Task Info */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{task.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                      {task.dueDate && (
                        <p className="text-xs text-gray-500 mt-1">📅 Due: {task.dueDate}</p>
                      )}
                      {task.adminComment && (
                        <p className="text-xs text-red-400 mt-2">
                          ❌ Admin comment: {task.adminComment}
                        </p>
                      )}
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusBadge(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 flex gap-2">

                    {/* PENDING → Start */}
                    {task.status === "PENDING" && (
                      <button
                        onClick={() => handleStart(task.id)}
                        className="bg-yellow-600 hover:bg-yellow-500 text-white text-sm px-4 py-2 rounded-lg transition"
                      >
                        Start Task
                      </button>
                    )}

                    {/* IN_PROGRESS → Submit Proof */}
                    {task.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => setShowProofModal(task.id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition"
                      >
                        Submit Proof
                      </button>
                    )}

                    {/* SUBMITTED — waiting */}
                    {task.status === "SUBMITTED" && (
                      <p className="text-blue-400 text-sm">
                        ⏳ Waiting for admin approval...
                      </p>
                    )}

                    {/* COMPLETED — locked */}
                    {task.status === "COMPLETED" && (
                      <p className="text-green-400 text-sm">
                        ✅ Task completed and approved!
                      </p>
                    )}
                  </div>

                  {/* Proof Modal (inline) */}
                  {showProofModal === task.id && (
                    <div className="mt-4 bg-gray-800 p-4 rounded-xl flex flex-col gap-3">
                      <h4 className="font-semibold text-blue-400">Submit Proof of Work</h4>

                      <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">GitHub Link</label>
                        <input
                          className="bg-gray-700 text-white p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://github.com/your-repo"
                          onChange={(e) => setProofForm({
                            ...proofForm,
                            [task.id]: {
                              ...proofForm[task.id],
                              proofLink: e.target.value
                            }
                          })}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-gray-400 text-sm">Description</label>
                        <textarea
                          className="bg-gray-700 text-white p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                          placeholder="Describe what you did..."
                          onChange={(e) => setProofForm({
                            ...proofForm,
                            [task.id]: {
                              ...proofForm[task.id],
                              proofDescription: e.target.value
                            }
                          })}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmitProof(task.id)}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition"
                        >
                          Submit
                        </button>
                        <button
                          onClick={() => setShowProofModal(null)}
                          className="bg-gray-600 hover:bg-gray-500 text-white text-sm px-4 py-2 rounded-lg transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}