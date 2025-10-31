import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";

axios.defaults.baseURL = "http://localhost:5000"; // ✅ Backend base URL

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post("/api/auth/login", form);
      localStorage.setItem("token", data.token);
      login(data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Google Login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse?.credential;
      if (!token) throw new Error("Missing Google credential");

      // Log the token and decoded data for debugging
      const decoded = jwtDecode(token);
      console.log("✅ Google user decoded:", decoded);
      console.log("✅ Google token:", token);

      // Send Google token to backend
      const { data } = await axios.post("/api/auth/google-login", { 
        token,
        isRegistration: false
      });

      console.log("✅ Backend response:", data);

      // Save JWT from backend
      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      login(data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Google login failed:", error);
      setError(error.response?.data?.message || "Google sign-in failed. Please try again.");
    }
  };

  console.log("Google Client ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="bg-gray-900/70 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-semibold text-center mb-3">Welcome Back</h2>
          <p className="text-gray-400 text-center mb-8">
            Login to continue reporting and tracking issues.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              focus:shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-200"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-md text-white placeholder-gray-400 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              focus:shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-200"
            />

            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium 
              transition-all duration-300 shadow-md disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-700" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-700" />
          </div>

          {/* ✅ Google Login Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google login failed")}
              theme="filled_blue"
              shape="pill"
              width="300"
            />
          </div>

          <p className="text-center text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-500 underline transition-all"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
