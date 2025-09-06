import React from "react";
import {
  User,
  Code,
  LogOut,
  ListFilter,
  Search,
  BookOpen,
  Home,
  Award,
  Layout as LayoutIcon,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b backdrop-blur-lg"
      style={{
        backgroundColor: "#F0FDFD",
        borderColor: "#B48C8E",
      }}
    >
      <div className="flex w-full justify-between items-center mx-auto px-4 lg:px-8 xl:px-12 py-3">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/leetlab.svg"
            className="h-8 w-8 p-1 rounded-md"
            style={{
              backgroundColor: "#F0FDFD",
              border: "1px solid #B48C8E",
            }}
            alt="LeetLab Logo"
          />
          <span className="text-xl font-bold tracking-tight" style={{ color: "#B48C8E" }}>
            LeetLab
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { to: "/", label: "Problems", icon: <Home className="w-4 h-4" /> },
            { to: "/playlists", label: "Playlists", icon: <BookOpen className="w-4 h-4" /> },
            { to: "/leaderboard", label: "Leaderboard", icon: <Award className="w-4 h-4" /> },
          ].map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive(to)
                  ? "bg-[#B48C8E22] text-[#B48C8E]"
                  : "text-[#B48C8E] hover:bg-[#B48C8E11]"
              }`}
            >
              <span className="flex items-center gap-1.5">{icon} {label}</span>
            </Link>
          ))}

          {/* Explore Dropdown */}
          <div className="relative group">
            <button className="px-3 py-2 rounded-md text-sm font-medium text-[#B48C8E] hover:bg-[#B48C8E11] flex items-center gap-1.5">
              <ListFilter className="w-4 h-4" />
              Explore
              <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-[#F0FDFD] border border-[#B48C8E] hidden group-hover:block">
              <div className="py-1">
                {["Top Interview Questions", "Top 100 Liked Questions", "Dynamic Programming"].map(
                  (text) => (
                    <a
                      key={text}
                      href="#"
                      className="block px-4 py-2 text-sm text-[#B48C8E] hover:bg-[#B48C8E11]"
                    >
                      {text}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search & User Profile */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-[#B48C8E]" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-1.5 text-sm rounded-md focus:outline-none"
              placeholder="Search problems..."
              style={{
                backgroundColor: "#F0FDFD",
                color: "#B48C8E",
                border: "1px solid #B48C8E",
              }}
            />
          </div>

          {/* User Dropdown */}
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-sm rounded-md p-2 flex items-center gap-2"
              style={{ backgroundColor: "#F0FDFD", border: "1px solid #B48C8E" }}
            >
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img
                  src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
                  alt="User Avatar"
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="hidden md:inline text-sm font-medium text-[#B48C8E]">
                {authUser?.name}
              </span>
              <ChevronDown className="w-4 h-4 text-[#B48C8E]" />
            </label>

            <ul
              tabIndex={0}
              className="dropdown-content menu menu-sm mt-2 z-[1] p-2 shadow-xl rounded-md w-56"
              style={{
                backgroundColor: "#F0FDFD",
                border: "1px solid #B48C8E",
              }}
            >
              <li className="px-3 py-2 border-b" style={{ borderColor: "#B48C8E" }}>
                <p className="text-sm font-medium text-[#B48C8E]">{authUser?.name}</p>
                <p className="text-xs text-[#B48C8E99]">{authUser?.email}</p>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[#B48C8E] hover:bg-[#B48C8E11]"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
              </li>

              {authUser?.role === "ADMIN" && (
                <li>
                  <Link
                    to="/add-problem"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-[#B48C8E] hover:bg-[#B48C8E11]"
                  >
                    <LayoutIcon className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                </li>
              )}

              <li>
                <LogoutButton>
                  <span className="flex items-center gap-2 text-sm text-[#B48C8E] hover:bg-[#B48C8E11] px-3 py-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </span>
                </LogoutButton>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
