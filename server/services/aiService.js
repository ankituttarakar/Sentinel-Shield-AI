import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") }); // Adjusted path to root .env

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const analyzeCode = async (code) => {
  try {
    // Using 1.5-flash as requested, or 2.0-flash for speed/cost balance
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a strict cybersecurity auditor. 
      Analyze this code and return ONLY a valid JSON object. 
      No conversational text, no markdown backticks.

      JSON structure:
      {
        "summary": "Brief overview",
        "vulnerabilities": [
          {
            "type": "Name of flaw",
            "severity": "Critical/High/Medium/Low",
            "description": "Details",
            "fix": "Code fix"
          }
        ],
        "improvements": ["tip 1", "tip 2"]
      }

      Code to audit:
      ${code}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // CLEANING: Strip markdown if Gemini ignores the "no backticks" rule
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    // RETURN PARSED OBJECT: This allows your Controller to access .vulnerabilities
    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("❌ AI SERVICE ERROR:", error.message);
    
    // FALLBACK: Return a structured object so the app doesn't crash
    return {
      summary: "Analysis failed due to a technical error.",
      vulnerabilities: [],
      improvements: ["Check your API quota", "Ensure the code snippet is valid"]
    };
  }
};

export default analyzeCode;