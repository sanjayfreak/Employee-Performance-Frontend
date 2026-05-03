import { getUser } from "../services/auth";

export default function Navbar() {
  const user = getUser();

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">AI Employee Performance Monitoring</h1>

      <div>
        <span className="mr-4">{user?.email}</span>
      </div>
    </div>
  );
}