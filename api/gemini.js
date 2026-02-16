
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { contents, systemInstruction, responseMimeType, responseSchema, maxOutputTokens, thinkingBudget } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
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
    res.status(500).json({ error: error.message });
  }
}
