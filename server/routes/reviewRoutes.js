import express from "express";
import { analyzeCode } from "../controllers/reviewController.js";

const router = express.Router();

// ✅ POST analyze
router.post("/analyze", analyzeCode);

// 🔥 ADD THIS (fixes your 404)
router.get("/", (req, res) => {
  res.json([]); // return empty for now
});

export default router;