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

  const isActive = (path) => {
    return location.pathname === path;
  };
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-lg">
      <div className="flex w-full justify-between items-center mx-auto px-4 lg:px-8 xl:px-12 py-3">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/leetlab.svg"
            className="h-8 w-8 bg-white/10 border border-gray-700 p-1 rounded-md"
            alt="LeetLab Logo"
          />
          <span className="text-xl font-bold tracking-tight text-white">
            LeetLab
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive("/")
                ? "bg-white/10 text-white"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Home className="w-4 h-4" />
              Problems
            </span>
          </Link>

          <div className="relative group">
            <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-1.5">
              <ListFilter className="w-4 h-4" />
              Explore
              <ChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-black border border-gray-700 hidden group-hover:block">
              <div className="py-1">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                >
                  Top Interview Questions
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                >
                  Top 100 Liked Questions
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                >
                  Dynamic Programming
                </a>
              </div>
            </div>
          </div>

          <Link
            to="/playlists"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive("/playlists")
                ? "bg-white/10 text-white"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Playlists
            </span>
          </Link>

          <Link
            to="/leaderboard"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive("/leaderboard")
                ? "bg-white/10 text-white"
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Leaderboard
            </span>
          </Link>
        </div>

        {/* Search and User Profile */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-1.5 text-sm text-white bg-black/40 border border-gray-700 rounded-md focus:ring-1 focus:ring-white focus:outline-none"
              placeholder="Search problems..."
            />
          </div>

          {/* User Profile and Dropdown */}
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-sm bg-white/5 border border-gray-800 rounded-md p-2 flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img
                  src={
                    authUser?.image ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
                  alt="User Avatar"
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="hidden md:inline text-sm font-medium text-white">
                {authUser?.name}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </label>

            <ul
              tabIndex={0}
              className="dropdown-content menu menu-sm mt-2 z-[1] p-2 shadow-xl bg-black border border-gray-800 rounded-md w-56"
            >
              <li className="px-3 py-2 border-b border-gray-800">
                <p className="text-sm font-medium text-white">
                  {authUser?.name}
                </p>
                <p className="text-xs text-gray-400">{authUser?.email}</p>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
              </li>

              {authUser?.role === "ADMIN" && (
                <li>
                  <Link
                    to="/add-problem"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    <LayoutIcon className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                </li>
              )}

              <li>
                <LogoutButton className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">
                  <LogOut className="w-4 h-4" />
                  Logout
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
