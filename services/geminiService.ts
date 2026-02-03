import { GoogleGenAI, Type } from "@google/genai";
import { FlashcardData } from "../types";

// Initialize Gemini Client
// IMPORTANT: Using process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFlashcardsFromList = async (
  rawText: string
): Promise<FlashcardData[]> => {
  try {
    const model = "gemini-3-flash-preview";
    
    // Schema definition for strict JSON output
    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING, description: "The vocabulary word itself" },
          pronunciation: { type: Type.STRING, description: "IPA pronunciation guide, e.g. /həˈləʊ/" },
          partOfSpeech: { type: Type.STRING, description: "Noun, Verb, Adjective, etc." },
          definition: { type: Type.STRING, description: "A simple definition in English" },
          translation: { type: Type.STRING, description: "The definition translated into Vietnamese" },
          exampleSentence: { type: Type.STRING, description: "A generic example sentence using the word" },
          tip: { type: Type.STRING, description: "A short tip, mnemonic, or synonym to help remember the word (in Vietnamese)" },
        },
        required: ["word", "pronunciation", "partOfSpeech", "definition", "translation", "exampleSentence"],
      },
    };

    const prompt = `
      I have a list of vocabulary words. Please act as an expert language tutor.
      For each word provided below, generate a detailed flashcard entry.
      
      The target audience is Vietnamese speakers learning English.
      1. 'translation' must be in Vietnamese.
      2. 'tip' should be in Vietnamese (helpful advice or mnemonic).
      3. 'definition' and 'exampleSentence' should be in English.
      
      Here is the list of words:
      ${rawText}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a helpful, precise vocabulary teacher. You always return valid JSON matching the schema.",
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as FlashcardData[];
      return data;
    }
    
    throw new Error("No data returned from AI");

  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};