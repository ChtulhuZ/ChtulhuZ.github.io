
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getSageAdvice = async (): Promise<string> => {
  if (!process.env.API_KEY) {
    return "La saggezza della Terra è silenziosa oggi. (La chiave API non è configurata)";
  }

  try {
    const prompt = `Sei un saggio spirito della Terra. Dammi un breve consiglio poetico o una mini-storia (massimo 3 frasi) su come riportare in vita una terra arida. Sii incoraggiante e fantasioso. Il giocatore sta cercando di far rivivere il pianeta cliccandoci sopra. Parla in italiano.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            temperature: 0.8,
            topK: 40,
        }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching advice from Gemini:", error);
    return "Un'interferenza cosmica disturba la voce della Terra. Riprova più tardi.";
  }
};
