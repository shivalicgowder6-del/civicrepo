import express from "express";
import { registerUser, loginUser, handleGoogleAuth } from "../controllers/authController.js";
const router = express.Router();

// 🟢 Basic Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🟢 Google OAuth Routes
router.post("/google-auth", handleGoogleAuth);

// 🟢 Debug route for Google OAuth
router.get("/google-status", (req, res) => {
  res.json({ 
    message: "Google OAuth endpoint is active",
    clientId: process.env.GOOGLE_CLIENT_ID ? "Configured" : "Missing",
    endpoints: {
      googleAuth: "/api/auth/google-auth"
    }
  });
});

// 🟢 Health check route
router.get("/", (req, res) => {
  res.json({ message: "Auth routes are working! 🚀" });
});

export default router;
