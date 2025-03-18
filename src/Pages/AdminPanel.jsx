import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-3xl font-bold mb-4">Welcome, Admin</h2>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
