import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Manually resolve the path to ensure we hit the right .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// 1. DEBUG CHECK: This will show you the first 4 and last 4 chars of your key in the console.
// If this says 'undefined', your .env file is in the wrong place or named incorrectly.
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("🚨 CRITICAL: GEMINI_API_KEY is missing from process.env!");
} else {
  console.log(`🔑 API Key detected: ${apiKey.substring(0, 4)}...${apiKey.slice(-4)}`);
}

const genAI = new GoogleGenerativeAI(apiKey);

export const analyzeCode = async (code) => {
  try {
    // March 2026: gemini-3.1-pro-preview is the current stable preview.
    // Ensure you aren't using "gemini-2.5-pro" or "gemini-3-pro-preview" (shut down Mar 9).
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    const prompt = `Perform a security audit on this code. Provide a 'Quick Review' section:\n\n${code}`;

    console.log("🔥 REQUESTING ANALYSIS FROM GEMINI 3.1...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return {
      success: true,
      analysis: response.text(),
    };

  } catch (error) {
    console.error("❌ GEMINI SDK ERROR:", error.message);
    
    return {
      success: false,
      analysis: `⚠️ AI Error: ${error.message}. (Using Fallback Mode)`,
    };
  }
};