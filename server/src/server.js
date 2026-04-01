import dotenv from "dotenv";
dotenv.config(); // MUST be first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import aiDecisionRoutes from "./routes/aiDecision.js";
import authRoutes from "./routes/authRoutes.js";

console.log("OpenAI Key loaded?", process.env.OPENAI_API_KEY ? "YES ✅" : "NO ❌");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", aiDecisionRoutes);

app.get("/", (req, res) => res.send("API Running..."));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));