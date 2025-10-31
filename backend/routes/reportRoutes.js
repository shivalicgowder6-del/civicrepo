import express from "express";
import multer from "multer";
import { createReport, getReports } from "../controllers/reportController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST: create new report
router.post("/reports", upload.single("image"), createReport);

// GET: fetch all reports
router.get("/reports", getReports);

export default router;
