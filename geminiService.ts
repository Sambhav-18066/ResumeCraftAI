
import { ResumeData, ResumeStyle } from "./types";

const RESUME_SCHEMA = {
  type: "OBJECT",
  properties: {
    page_limit: { type: "INTEGER" },
    sections: {
      type: "OBJECT",
      properties: {
        introduction: { type: "STRING", nullable: true },
        contact: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING", nullable: true },
            email: { type: "STRING", nullable: true },
            phone: { type: "STRING", nullable: true },
            location: { type: "STRING", nullable: true }
          }
        },
        socials: {
          type: "OBJECT",
          properties: {
            linkedin: { type: "STRING", nullable: true },
            portfolio: { type: "STRING", nullable: true },
            other: { type: "ARRAY", items: { type: "STRING" } }
          }
        },
        education: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              degree: { type: "STRING", nullable: true },
              institution: { type: "STRING", nullable: true },
              location: { type: "STRING", nullable: true },
              start_year: { type: "STRING", nullable: true },
              end_year: { type: "STRING", nullable: true },
              details: { type: "STRING", nullable: true }
            }
          }
        },
        skills: {
          type: "OBJECT",
          properties: {
            technical: { type: "ARRAY", items: { type: "STRING" } },
            laboratory: { type: "ARRAY", items: { type: "STRING" } },
            software: { type: "ARRAY", items: { type: "STRING" } },
            soft: { type: "ARRAY", items: { type: "STRING" } }
          }
        },
        experience: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              role: { type: "STRING", nullable: true },
              organization: { type: "STRING", nullable: true },
              location: { type: "STRING", nullable: true },
              start_date: { type: "STRING", nullable: true },
              end_date: { type: "STRING", nullable: true },
              responsibilities: { type: "ARRAY", items: { type: "STRING" } }
            }
          }
        },
        projects: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING", nullable: true },
              description: { type: "ARRAY", items: { type: "STRING" } }
            }
          }
        },
        languages: { type: "ARRAY", items: { type: "STRING" } }
      }
    }
  },
  required: ["page_limit", "sections"]
};

export const generateResume = async (
  inputText: string,
  pageLimit: number,
  style: ResumeStyle,
  selectedSections: string[]
): Promise<ResumeData> => {
  const prompt = `
RAW_INPUT:
"""
${inputText}
"""

PAGE_LIMIT: ${pageLimit}
RESUME_STYLE: ${style}
SELECTED_SECTIONS: ${selectedSections.join(', ')}

Generate a resume using ONLY the selected sections. Return ONLY valid JSON.
  `;

  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: "You are a professional resume generator. Extract factual info, rewrite for clarity, and return valid JSON. Do not invent info.",
      responseMimeType: "application/json",
      responseSchema: RESUME_SCHEMA,
      maxOutputTokens: 20000,
      thinkingBudget: 10000
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return JSON.parse(data.text) as ResumeData;
};

export const sendChatMessage = async (message: string, history: any[] = []) => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      systemInstruction: "You are a professional career consultant. Help users structure their resumes and present their experience clearly.",
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.text;
};
