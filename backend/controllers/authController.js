import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

// ✅ Initialize Google OAuth Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ Verify Google token
const verifyGoogleToken = async (token) => {
  try {
    console.log("Verifying token with client ID:", process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    return ticket.getPayload();
  } catch (error) {
    console.error("Google token verification failed:", error);
    throw new Error("Invalid Google token");
  }
};

// ---------------------- REGISTER ----------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ---------------------- LOGIN ----------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ---------------------- GOOGLE AUTH ----------------------
export const handleGoogleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      console.error("No token provided in request");
      return res.status(400).json({ message: "No token provided" });
    }

    console.log("Processing Google auth with token:", token.substring(0, 20) + "...");

    try {
      // Verify the Google token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      console.log("Google token verified successfully");

      if (!payload || !payload.email) {
        console.error("Invalid payload received from Google");
        return res.status(400).json({ message: "Invalid Google token payload" });
      }

      // Extract user information
      const { email, name, picture, sub: googleId } = payload;

      // Find or create user
      let user = await User.findOne({ email });

      if (!user) {
        console.log("Creating new user from Google auth");
        user = new User({
          name,
          email,
          password: jwt.sign({ email }, process.env.JWT_SECRET),
          profilePicture: picture,
          googleId
        });
        await user.save();
        console.log("New user created successfully");
      }

      // Generate JWT token
      const authToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      console.log(`✅ Google auth successful for: ${email}`);

      // Send success response
      res.json({
        token: authToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture || picture
        }
      });

    } catch (verifyError) {
      console.error("Token verification failed:", verifyError);
      return res.status(401).json({ 
        message: "Google token verification failed",
        details: verifyError.message 
      });
    }

  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ 
      message: "Authentication failed", 
      details: error.message 
    });
  }
};
