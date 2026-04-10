import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import aiDecisionRoutes from "./routes/aiDecision.js";
import authRoutes from "./routes/authRoutes.js";
import debateRoutes from "./routes/debateRoutes.js";

console.log(
  "OpenAI Key loaded?",
  process.env.OPENAI_API_KEY ? "YES ✅" : "NO ❌"
);

const app = express();

// ✅ better CORS for frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", aiDecisionRoutes);
app.use("/api", debateRoutes);

app.get("/", (req, res) => res.send("API Running..."));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);