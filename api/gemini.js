
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { contents, systemInstruction, responseMimeType, responseSchema, maxOutputTokens, thinkingBudget } = req.body;

  try {
    // Switching to gemini-3-flash-preview for better availability and higher rate limits on free tier
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction,
        responseMimeType,
        responseSchema,
        maxOutputTokens,
        thinkingConfig: thinkingBudget ? { thinkingBudget } : undefined
      },
    });

    res.status(200).json({ text: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return specific status if it's a quota issue
    const statusCode = error.status === 429 ? 429 : 500;
    res.status(statusCode).json({ error: error.message || "An error occurred during generation" });
  }
}
