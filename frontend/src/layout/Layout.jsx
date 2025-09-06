import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen w-full bg-[#fffafa] text-[#3b2e2e]">
      <Navbar />
      <div className="w-full px-4 lg:px-8 xl:px-12 py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
