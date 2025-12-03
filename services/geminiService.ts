import { GoogleGenAI } from "@google/genai";
import { RevenueStats } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) {
    console.warn("API Key not found in environment.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getBusinessInsights = async (stats: RevenueStats): Promise<string> => {
  const ai = createClient();
  if (!ai) return "AI Insights unavailable (Missing API Key).";

  try {
    const prompt = `
      You are a business consultant for a car wash in Kerala.
      Here is the revenue data for today:
      - App Orders (Online): ₹${stats.todayApp}
      - Walk-ins (Offline): ₹${stats.todayWalkIn}
      
      Compare the two channels. Give me one single, punchy, actionable tip (max 20 words) to improve the lower performing channel.
      Do not use markdown. Just plain text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Focus on customer satisfaction to drive growth.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate insights at this moment.";
  }
};
