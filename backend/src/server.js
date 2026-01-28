import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
// import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";
import problemsRoutes from "./routes/problemsRoute.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// middleware
app.use(express.json());
app.use(cookieParser()); // parse cookies

// CORS configuration
app.use(cors({
  origin: ENV.CLIENT_URL, // Must be set in production
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/problems", problemsRoutes);
app.use("/api/auth", authRoutes);


app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  // app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // app.get("/{*any}", (req, res) => {
  //   res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  // });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
