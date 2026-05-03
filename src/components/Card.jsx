export default function Card({ title, value, color }) {
  return (
    <div className={`p-4 rounded-xl shadow-lg ${color || "bg-gray-800"} text-white`}>
      <h3 className="text-sm opacity-70">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}