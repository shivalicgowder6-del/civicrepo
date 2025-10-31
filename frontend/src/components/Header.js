// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import getInitials from "../utils/getInitials";

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <header className="w-full sticky top-0 z-40 bg-[#0b1120] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-white tracking-wide">
          Civic Sentinel
        </Link>

        {!isLoggedIn ? (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-gray-300 hover:text-white text-sm">Login</Link>
            <Link
              to="/register"
              className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((s) => !s)}
              className="w-9 h-9 rounded-full bg-blue-600 text-white grid place-items-center font-semibold"
              title={user?.name}
            >
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                getInitials(user?.name)
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 rounded-lg bg-[#111827] border border-gray-700 shadow-lg overflow-hidden">
                <button
                  onClick={() => { setOpen(false); navigate("/dashboard"); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800 text-gray-200"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { setOpen(false); navigate("/myreports"); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800 text-gray-200"
                >
                  My Reports
                </button>
                <button
                  onClick={() => { setOpen(false); logout(); navigate("/"); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800 text-red-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
