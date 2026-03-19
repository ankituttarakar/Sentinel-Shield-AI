import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ENV
const API_KEY = process.env.GEMINI_API_KEY?.trim();
const MONGO_URI = process.env.MONGO_URI;

if (!API_KEY || !MONGO_URI) {
  console.error("Missing ENV variables");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

// DB
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.error("DB Error:", err.message);
    process.exit(1);
  });

// SCHEMA (UPDATED: score → risk)
const ReviewSchema = new mongoose.Schema({
  code: String,
  review: Object,
  risk: String,
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model("Review", ReviewSchema);

// ----------------------
// HELPERS
// ----------------------

const getRiskLevel = (vulnerabilities) => {
  const severities = (vulnerabilities || []).map(v =>
    (v.severity || "").toLowerCase().trim()
  );

  if (severities.includes("critical")) return "CRITICAL";
  if (severities.includes("high")) return "HIGH";
  if (severities.includes("medium")) return "MEDIUM";
  return "LOW";
};

// ----------------------
// ROUTES
// ----------------------

// GET history
app.get("/api/reviews", async (req, res) => {
  try {
    const data = await Review.find().sort({ createdAt: -1 });
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// ANALYZE
app.post("/api/review", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a strict cybersecurity auditor AI.

Return ONLY valid JSON:

{
  "summary": "string",
  "vulnerabilities": [
    {
      "type": "string",
      "severity": "Critical/High/Medium/Low",
      "description": "string",
      "fix": "string"
    }
  ],
  "improvements": ["string"]
}

Rules:
- IDOR, Injection, Auth flaws → Critical
- XSS → High
- Data Exposure → Medium
- Always include severity + fix

Code:
${code}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    let text = response.text().replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        summary: text,
        vulnerabilities: [],
        improvements: ["AI parsing failed"]
      };
    }

    // CLEAN + NORMALIZE
    parsed.vulnerabilities = (parsed.vulnerabilities || []).map(v => {
      const sev = (v.severity || "").toLowerCase().trim();

      let normalized =
        sev === "critical" ? "Critical" :
        sev === "high" ? "High" :
        sev === "medium" ? "Medium" :
        sev === "low" ? "Low" :
        "Medium";

      return {
        type: typeof v.type === "string" ? v.type : "Unknown",
        severity: normalized,
        description: typeof v.description === "string"
          ? v.description
          : "No description",
        fix: typeof v.fix === "string"
          ? v.fix
          : "Apply proper security controls"
      };
    });

    parsed.improvements = (parsed.improvements || []).map(i =>
      typeof i === "string" ? i : JSON.stringify(i)
    );

    // ✅ RISK LOGIC (replaces score)
    const risk = getRiskLevel(parsed.vulnerabilities);

    const saved = await Review.create({
      code,
      review: parsed,
      risk
    });

    res.json({
      review: parsed,
      risk,
      id: saved._id
    });

  } catch (error) {
    console.error("AI ERROR:", error.message);

    const fallback = {
      summary: "AI unavailable. Using fallback.",
      vulnerabilities: [],
      improvements: ["Retry later"]
    };

    const saved = await Review.create({
      code,
      review: fallback,
      risk: "LOW"
    });

    res.json({
      review: fallback,
      risk: "LOW",
      id: saved._id
    });
  }
});

// DELETE
app.delete("/api/review/:id", async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.json({ message: "Deleted", id: req.params.id });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});