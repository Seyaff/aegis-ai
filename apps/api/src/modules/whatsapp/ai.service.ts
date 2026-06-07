import { GoogleGenAI, Type } from "@google/genai";
import { Env } from "../../config/app.config";

const aiKey = Env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: aiKey });

export interface IClassificationResult {
  category: "SUPPORT" | "LEAD" | "LOGS_REQUEST" | "GENERAL_INQUIRY";
  confidence: number;
  reasoning: string;
}

export const classifyIncomingMessage = async (textBody: string): Promise<IClassificationResult> => {

  const modelPipeline = ["gemini-2.5-flash", "gemini-2.5-pro"];
  
  const prompt = `Analyze the intent of this incoming user WhatsApp message and categorize it.
  
  User Message: "${textBody}"`;

  for (const modelName of modelPipeline) {
    try {
      console.log(`🤖 Attempting intent analysis with ${modelName}...`);
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: "You are the classification router for Aegis AI. Categorize messages strictly into SUPPORT, LEAD, LOGS_REQUEST, or GENERAL_INQUIRY.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                enum: ["SUPPORT", "LEAD", "LOGS_REQUEST", "GENERAL_INQUIRY"],
              },
              confidence: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
            },
            required: ["category", "confidence", "reasoning"],
          },
        },
      });

      if (response.text) {
        return JSON.parse(response.text) as IClassificationResult;
      }
    } catch (error: any) {
  
      if (error?.status === 503) {
        console.warn(`⚠️ ${modelName} is busy (503). Retrying with alternative model layout...`);
        continue;
      }

      console.error(`❌ Non-503 exception in pipeline on ${modelName}:`, error);
      break;
    }
  }

  return {
    category: "GENERAL_INQUIRY",
    confidence: 0.5,
    reasoning: "Fallback triggered due to complete remote provider congestion.",
  };
};