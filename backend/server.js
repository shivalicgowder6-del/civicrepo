import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// ✅ Import routes
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

// ✅ Load environment variables
dotenv.config();

// ✅ Initialize Express app
const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // allow cookies if used later
  })
);
app.use(express.json()); // Parse JSON bodies

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // stop server if DB fails
  }
};
connectDB();

// ✅ API Routes
app.use("/api/auth", authRoutes);  // Authentication routes (register/login/google)
app.use("/api", reportRoutes);     // Report routes (if any)

// ✅ Health check / Root endpoint
app.get("/", (req, res) => {
  res.status(200).send("🚀 Civic Sentinel Backend is running successfully!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
