
import { GoogleGenAI } from "@google/genai";

export const getSageAdvice = async (apiKey: string): Promise<string> => {
  if (!apiKey) {
    return "La saggezza della Terra è silenziosa oggi. (La chiave API non è configurata)";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
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
    if (error instanceof Error && error.message.includes('API key not valid')) {
        return "La chiave API inserita non è valida. Controllala e riprova.";
    }
    return "Un'interferenza cosmica disturba la voce della Terra. Riprova più tardi.";
  }
};