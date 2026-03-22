import Review from "../models/Review.js";
import aiService from "../services/aiService.js";

export const analyzeCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "Code is required" });
    }

    // 1. Get the AI Analysis from your service
    const review = await aiService(code);

    // 2. Extract Risk Level for the Sidebar (CRITICAL, HIGH, etc.)
    // We look at the vulnerabilities array returned by the AI
    const severities = (review.vulnerabilities || []).map(v => 
      v.severity.toUpperCase().trim()
    );

    let risk = "LOW";
    if (severities.includes("CRITICAL")) risk = "CRITICAL";
    else if (severities.includes("HIGH")) risk = "HIGH";
    else if (severities.includes("MEDIUM")) risk = "MEDIUM";

    // 3. PERSISTENCE: Save to MongoDB so it shows up in History
    const savedEntry = await Review.create({
      code,
      review, // The full JSON object (summary, vulnerabilities, improvements)
      risk,   // The calculated string for the Badge
    });

    // 4. Return the saved data including the MongoDB _id
    return res.status(200).json({
      success: true,
      review,
      risk,
      id: savedEntry._id 
    });

  } catch (error) {
    console.error("❌ Controller Crash:", error.message);

    // Fallback: Still try to return something so the UI doesn't hang
    return res.status(500).json({
      success: false,
      message: "Analysis failed",
      review: { summary: "Error processing code.", vulnerabilities: [], improvements: [] }
    });
  }
};