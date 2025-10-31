import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["open", "pending", "resolved"],
      default: "open",
    },
    issueCategory: { type: String, default: "General" },
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
  },
  { timestamps: true }
);

reportSchema.index({ location: "2dsphere" });

const Report = mongoose.model("Report", reportSchema);
export default Report;
