import express from "express";
import { analyzeCode } from "../controllers/reviewController.js";

const router = express.Router();

// ✅ FIXED ROUTE
router.post("/review", analyzeCode);

// (optional)
router.get("/reviews", (req, res) => {
  res.json([]);
});

export default router;