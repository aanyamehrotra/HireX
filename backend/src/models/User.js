import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Optional for Google Auth users
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Only enforce uniqueness for documents that have this field
    },
    role: {
      type: String,
      enum: ["interviewer", "candidate"],
      required: true,
    },
    headline: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    clerkId: {
      type: String, // Kept for backward compatibility or optional external auth
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

const User = mongoose.model("User", userSchema);

export default User;
