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
      required: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
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
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
