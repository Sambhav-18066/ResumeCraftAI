import { GoogleGenAI, Type } from "@google/genai";
import { ResumeStyle } from "./types.js";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RESUME_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    page_limit: { type: Type.INTEGER },
    sections: {
      type: Type.OBJECT,
      properties: {
        introduction: { type: Type.STRING, nullable: true },
        contact: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, nullable: true },
            email: { type: Type.STRING, nullable: true },
            phone: { type: Type.STRING, nullable: true },
            location: { type: Type.STRING, nullable: true }
          }
        },
        socials: {
          type: Type.OBJECT,
          properties: {
            linkedin: { type: Type.STRING, nullable: true },
            portfolio: { type: Type.STRING, nullable: true },
            other: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              degree: { type: Type.STRING, nullable: true },
              institution: { type: Type.STRING, nullable: true },
              location: { type: Type.STRING, nullable: true },
              start_year: { type: Type.STRING, nullable: true },
              end_year: { type: Type.STRING, nullable: true },
              details: { type: Type.STRING, nullable: true }
            }
          }
        },
        skills: {
          type: Type.OBJECT,
          properties: {
            technical: { type: Type.ARRAY, items: { type: Type.STRING } },
            laboratory: { type: Type.ARRAY, items: { type: Type.STRING } },
            software: { type: Type.ARRAY, items: { type: Type.STRING } },
            soft: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        experience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING, nullable: true },
              organization: { type: Type.STRING, nullable: true },
              location: { type: Type.STRING, nullable: true },
              start_date: { type: Type.STRING, nullable: true },
              end_date: { type: Type.STRING, nullable: true },
              responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        },
        projects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, nullable: true },
              description: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        },
        languages: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    }
  },
  required: ["page_limit", "sections"]
};

export const generateResume = async (inputText, pageLimit, style, selectedSections) => {
  const prompt = `
RAW_INPUT:
"""
${inputText}
"""
PAGE_LIMIT: ${pageLimit}
RESUME_STYLE: ${style}
SELECTED_SECTIONS: ${selectedSections.join(', ')}

Generate a professional resume in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: "You are a professional resume generator. Extract factual info, rewrite for clarity, and return valid JSON strictly following the schema. Do not invent info.",
      responseMimeType: "application/json",
      responseSchema: RESUME_SCHEMA,
      maxOutputTokens: 20000,
      thinkingConfig: { thinkingBudget: 10000 }
    },
  });

  if (!response.text) throw new Error("No response from Gemini");
  return JSON.parse(response.text);
};

export const createCareerChat = () => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: 'You are a professional career consultant. Help users with resume structure and clarity.',
    },
  });
};