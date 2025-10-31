import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./RegisterPage.css";

// Configure axios with the backend URL and CORS settings
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true; // Enable credentials
axios.defaults.headers.post['Content-Type'] = 'application/json';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/auth/register", formData);
      alert("✅ Registration successful!");
      console.log("Token:", res.data.token);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("❌ Registration failed. Please try again.");
    }
  };

  // ✅ Google Signup
  const handleGoogleSignup = async (credentialResponse) => {
    try {
      console.log("Google response:", credentialResponse);
      const token = credentialResponse?.credential;
      if (!token) {
        console.error("No credential received from Google");
        throw new Error("Missing Google credential");
      }

      // Decode and log the token information
      const decoded = jwtDecode(token);
      console.log("✅ Google user info:", decoded);

      // Send to your backend
      const { data } = await axios.post("/api/auth/google-auth", {
        token,
        isRegistration: true,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      });

      console.log("✅ Backend response:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        navigate("/dashboard");
      } else {
        throw new Error("No token received from backend");
      }
    } catch (error) {
      console.error("❌ Google signup failed:", error);
      setError(error.response?.data?.message || "Google sign-up failed. Please try again.");
    }
  };

  return (
    <GoogleOAuthProvider clientId="472772842957-nbs8iu64taln1l5i6e1bnfkq9858aqfq.apps.googleusercontent.com">
      <div className="register-container">
        <div className="register-card">
          <h2>Create Account</h2>
          <p>Join Civic Sentinel to improve your community.</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Enter password (min 6 chars)"
              onChange={handleChange}
              required
            />
            <button type="submit">Register</button>
          </form>

          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-700" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-700" />
          </div>

          {/* ✅ Google Signup Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => {
                console.error("Google Login Failed");
                setError("Google sign-up failed. Please try again.");
              }}
              useOneTap={false}
              theme="filled_blue"
              text="signup_with"
              shape="rectangular"
              width="300"
            />
          </div>

          <p style={{ marginTop: "15px" }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default RegisterPage;
