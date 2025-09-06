import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const LogoutButton = ({ children }) => {
  const { logout } = useAuthStore();

  const onLogout = async () => {
    await logout();
  };

  return (
    <button
      onClick={onLogout}
      className="px-4 py-2 rounded-md font-medium transition duration-200"
      style={{
        backgroundColor: "#B48C8E",
        color: "#FFFFFF",
        border: "none"
      }}
    >
      {children}
    </button>
  );
};

export default LogoutButton;
