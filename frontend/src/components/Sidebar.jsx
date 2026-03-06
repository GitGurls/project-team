import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-6">

      <h2 className="text-2xl font-bold mb-10">
        TaskFlow
      </h2>

      <nav className="space-y-4">

        <Link to="/dashboard" className="block hover:text-blue-400">
          Dashboard
        </Link>

        <Link to="/profile" className="block hover:text-blue-400">
          Profile
        </Link>

      </nav>

    </div>
  );
}