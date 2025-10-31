import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
  type: String,
  required: function () {
    return !this.googleId; // password is required only if not using Google
  },
},
googleId: {
  type: String,
  default: null,
},
avatar: {
  type: String,
  default: "",
},

  },
  { timestamps: true }
);

// ✅ Default export (important for ES modules)
export default mongoose.model("User", userSchema);
