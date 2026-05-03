import { useEffect, useState } from "react";
import api from "../services/api";
import { getUser } from "../services/auth";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import Card from "../components/Card";

export default function EmployeeDashboard() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  const getColor = (score) => {
    if (score < 50) return "bg-red-600";
    if (score < 70) return "bg-orange-500";
    if (score < 80) return "bg-yellow-500";
    return "bg-green-600";
  };

  useEffect(() => {
    const user = getUser();
    const userId = user.userId; // ✅ was user.id || user._id, but saveUser stores as userId

    api.get(`/performance/dashboard/${userId}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));

    api.get(`/performance/history/${userId}`)
      .then(res => {
        const formatted = res.data.map(item => ({
          ...item,
          date: new Date(item.createdAt).toLocaleDateString()
        }));
        setHistory(formatted);
      })
      .catch(err => console.error(err)); // ✅ added missing catch
  }, []);

  if (!data) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="flex">
      <Sidebar role="EMPLOYEE" />
      <div className="flex-1 bg-black text-white min-h-screen">
        <Navbar />
        <div className="p-6 space-y-6">
          <h1 className="text-xl font-bold">Employee Dashboard</h1>

          <h2 className="text-lg font-semibold">Performance Overview</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="hover:scale-105 transition">
              <Card title="Score" value={`${data.score}%`} color={getColor(data.score)} />
            </div>
            <div className="hover:scale-105 transition">
              <Card title="Tasks" value={data.tasks?.length ?? 0} color="bg-purple-600" />
            </div>
            <div className="hover:scale-105 transition">
              <Card title="Trend" value={data.trend} color="bg-blue-600" />
            </div>
            <div className="hover:scale-105 transition">
              <Card
                title="Status"
                value={data.score < 80 ? "Warning" : "Good"}
                color={data.score < 80 ? "bg-red-600" : "bg-green-600"} // ✅ dynamic color
              />
            </div>
          </div>

          <h2 className="text-lg font-semibold">Performance Trend</h2>
          <div className="bg-gray-900 p-4 rounded-xl flex justify-center">
            <LineChart width={600} height={250} data={history}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#60a5fa" />
            </LineChart>
          </div>

          <div className="bg-purple-800 p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">AI Recommendation</h3>
            <p>{data.aiInsight?.insight ?? "No insight available"}</p>
            <p className="mt-2">📘 {data.aiInsight?.course ?? ""}</p>
          </div>

          <h2 className="text-lg font-semibold">Tasks</h2>
          <div className="bg-gray-900 p-4 rounded-xl">
            {data.tasks?.length === 0 && (
              <p className="opacity-60">No tasks assigned</p>
            )}
            {data.tasks?.map((task, i) => (
              <div key={i} className="flex justify-between bg-gray-800 p-2 rounded mb-2">
                <span>{task.name}</span>
                <span className="text-sm opacity-70">{task.status}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}