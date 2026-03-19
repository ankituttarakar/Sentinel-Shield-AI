import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// ✅ 1. API KEY VALIDATION
const API_KEY = process.env.GEMINI_API_KEY?.trim();
if (!API_KEY || API_KEY.includes("YOUR_API_KEY")) {
  console.error("❌ ERROR: Valid GEMINI_API_KEY is missing from .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

// ✅ 2. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// ✅ 3. SCHEMA & MODEL
const ReviewSchema = new mongoose.Schema({
  code: String,
  review: String,
  createdAt: { type: Date, default: Date.now }
});
const Review = mongoose.model("Review", ReviewSchema);

// ✅ 4. ROUTES

// GET HISTORY
app.get("/api/reviews", async (req, res) => {
  try {
    const data = await Review.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// POST ANALYSIS
app.post("/api/review", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "No code provided" });

  try {
    console.log("🔥 INITIATING ANALYSIS WITH GEMINI 2.5 FLASH...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Analyze this code for security vulnerabilities, bugs, and improvements. Provide a clear 'Quick Review' section followed by specific code fixes:\n\n${code}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reviewText = response.text();

    const savedReview = await Review.create({ code, review: reviewText });
    res.json({ review: reviewText, id: savedReview._id });
  } catch (error) {
    console.error("❌ GEMINI SDK ERROR:", error.message);
    res.status(500).json({ error: "AI Analysis Failed", message: error.message });
  }
});

// ✅ DELETE ANALYSIS HISTORY ITEM
app.delete("/api/review/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Analysis deleted successfully", id });
  } catch (err) {
    console.error("❌ DELETE ERROR:", err.message);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// ✅ 5. START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});