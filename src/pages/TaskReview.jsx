import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function TaskReview() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [adminComment, setAdminComment] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/tasks/submitted")
      .then(res => setTasks(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (taskId) => {
    try {
      await api.post(`/tasks/${taskId}/approve`);
      setTasks(tasks.filter(t => t.id !== taskId));
      setMessage("✅ Task approved successfully!");
    } catch (err) {
      setMessage("❌ Failed to approve task.");
      console.error(err);
    }
  };

  const handleReject = async (taskId) => {
    if (!adminComment.trim()) {
      setMessage("Please enter a comment for rejection.");
      return;
    }
    try {
      await api.post(`/tasks/${taskId}/reject`, { adminComment });
      setTasks(tasks.filter(t => t.id !== taskId));
      setRejectModal(null);
      setAdminComment("");
      setMessage("❌ Task rejected and sent back to employee.");
    } catch (err) {
      setMessage("❌ Failed to reject task.");
      console.error(err);
    }
  };

  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="flex">
      <Sidebar role="ADMIN" />
      <div className="flex-1 bg-black text-white min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-xl font-bold mb-2">Task Reviews</h1>
          <p className="text-gray-400 text-sm mb-6">
            Review employee submitted proofs and approve or reject them.
          </p>

          {message && (
            <p className="mb-4 text-sm p-3 bg-gray-800 rounded-lg">{message}</p>
          )}

          {tasks.length === 0 ? (
            <div className="bg-gray-900 p-8 rounded-xl text-center">
              <p className="text-gray-400 text-lg">🎉 No tasks pending review</p>
              <p className="text-gray-600 text-sm mt-2">
                All submitted tasks have been reviewed
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {tasks.map(task => (
                <div key={task.id} className="bg-gray-900 p-5 rounded-xl border border-gray-700">

                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{task.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                    </div>
                    <span className="bg-blue-900 text-blue-400 text-xs px-3 py-1 rounded-full font-semibold">
                      SUBMITTED
                    </span>
                  </div>

                  <div className="flex gap-4 mb-4 text-xs text-gray-500">
                    <span>📅 Due: {task.dueDate}</span>
                    <span>👤 Employee ID: {task.assignedTo}</span>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg mb-4">
                    <h4 className="text-blue-400 font-semibold text-sm mb-3">
                      📋 Proof of Work
                    </h4>
                    <div className="mb-2">
                      <p className="text-gray-500 text-xs mb-1">GitHub Link</p>
                      <a
                        href={task.proofLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline text-sm break-all"
                      >
                        🔗 {task.proofLink}
                      </a>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Description</p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {task.proofDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(task.id)}
                      className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => setRejectModal(rejectModal === task.id ? null : task.id)}
                      className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      ❌ Reject
                    </button>
                  </div>

                  {rejectModal === task.id && (
                    <div className="mt-4 bg-gray-800 p-4 rounded-xl flex flex-col gap-3 border border-red-900">
                      <h4 className="text-red-400 font-semibold">Reason for Rejection</h4>
                      <p className="text-gray-400 text-xs">
                        This will be shown to the employee. Task goes back to IN_PROGRESS.
                      </p>
                      <textarea
                        className="bg-gray-700 text-white p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 h-24 resize-none"
                        placeholder="Tell the employee what to fix..."
                        value={adminComment}
                        onChange={(e) => setAdminComment(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReject(task.id)}
                          className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-lg transition font-semibold"
                        >
                          Confirm Reject
                        </button>
                        <button
                          onClick={() => {
                            setRejectModal(null);
                            setAdminComment("");
                          }}
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