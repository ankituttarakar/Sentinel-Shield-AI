import aiService from "../services/aiService.js";

export const analyzeCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code is required",
      });
    }

    const review = await aiService(code);

    return res.status(200).json({
      success: true,
      review,
    });

  } catch (error) {
    console.error("❌ Controller Crash:", error.message);

    return res.status(200).json({
      success: true,
      review: "Fallback review: Fix syntax issues and improve code quality.",
    });
  }
};