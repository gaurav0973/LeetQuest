import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "lucide-react";

const AdminRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: '#F0FDFD' }}
      >
        <Loader
          className="animate-spin"
          style={{ color: '#B48C8E', width: '40px', height: '40px' }}
        />
      </div>
    );
  }

  if (!authUser || authUser.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
