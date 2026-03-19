import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

// 📊 GET System Stats (for charts)
router.get("/stats", async (req, res) => {
  try {
    const total = await Review.countDocuments();

    // You can later calculate real severity counts from DB
    res.json([
      { name: "Critical", value: 5 },
      { name: "Warning", value: 12 },
      { name: "Info", value: total }
    ]);

  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: "Stats error" });
  }
});

// 📄 GET All Reviews (for history panel)
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("Fetch Reviews Error:", err);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// 🧪 HEALTH CHECK (optional but useful)
router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default router;