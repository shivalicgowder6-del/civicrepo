import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import Report from "../models/Report.js";
import fs from "fs";

// ✅ Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "civic_sentinel",
    });

    // ✅ Get coordinates from frontend
    const { lat, lng, notes } = req.body;

    const newReport = new Report({
      imageUrl: result.secure_url,
      notes: notes || "",
      status: "open",
      issueCategory: "General",
      citizen: "000000000000000000000000",
      location: {
        type: "Point",
        coordinates: [parseFloat(lng) || 0, parseFloat(lat) || 0],
      },
    });

    await newReport.save();
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: "Report created successfully",
      report: newReport,
    });
  } catch (error) {
    console.error("Detailed error in createReport:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Fetch reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
