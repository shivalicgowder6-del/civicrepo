import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-[#0a0f1f] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left: Brand */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
        >
          Civic Sentinel
        </Link>

        {/* Right: Navigation */}
        <nav className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 text-sm font-medium rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white transition duration-200"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
