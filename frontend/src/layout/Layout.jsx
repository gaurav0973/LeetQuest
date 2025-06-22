import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <Navbar />
      <div className="w-full px-4 lg:px-8 xl:px-12">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
