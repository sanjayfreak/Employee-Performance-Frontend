import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AssignTask from "./pages/AssignTask";
import MyTasks from "./pages/MyTask";
import ProtectedRoute from "./components/ProtectedRoute";
import TaskReview from "./pages/TaskReview";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/employee" element={
        <ProtectedRoute role="EMPLOYEE">
          <EmployeeDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute role="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/assign" element={
        <ProtectedRoute role="ADMIN">
          <AssignTask />
        </ProtectedRoute>
      } />
<Route path="/review" element={
  <ProtectedRoute role="ADMIN">
    <TaskReview />
  </ProtectedRoute>
} />
      <Route path="/tasks" element={
        <ProtectedRoute>
          <MyTasks />
        </ProtectedRoute>
      } />

    </Routes>
  );
}

export default App;


