import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#020617] text-white py-4 px-8 flex justify-between items-center shadow-lg">
      {/* Left side: Logo/Brand */}
      <Link
        to="/"
        className="text-2xl font-semibold tracking-wide hover:text-blue-400 transition-colors"
      >
        Civic Sentinel
      </Link>

      {/* Right side: Auth Links */}
      <div className="space-x-6">
        <Link
          to="/login"
          className="text-gray-300 hover:text-blue-400 transition-colors"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-blue-600 px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
