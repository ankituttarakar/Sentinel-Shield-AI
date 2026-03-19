import dotenv from "dotenv";
dotenv.config();

const aiService = async (code) => {
  try {
    // 🔴 If API key not present → fallback
    if (!process.env.OPENAI_API_KEY) {
      console.log("⚠️ No API key found, using fallback response");

      return `
AI Review (Mock Mode):

✅ No syntax errors detected
⚠️ Use parentheses in Python print: print(a)
💡 Consider adding comments for clarity
      `;
    }

    // ✅ If API key exists → use real AI
    const OpenAI = (await import("openai")).default;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a senior code reviewer.",
        },
        {
          role: "user",
          content: `Review this code:\n${code}`,
        },
      ],
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("❌ AI Service Crash:", error.message);

    // 🔥 NEVER crash server again
    return `
AI Review (Error Fallback):

❌ AI service failed
💡 Possible reasons:
- Invalid API key
- No internet
- API quota exceeded

Suggestion:
- Fix print syntax → print(a)
`;
  }
};

export default aiService;