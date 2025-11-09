import { GoogleGenAI, Type, Chat, Part } from "@google/genai";
import type { QuizQuestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const imageToPart = (base64Data: string): Part => {
    return {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
        }
    };
};

export const generateNotes = async (topic: string, imageBase64: string | null, language: string, standard: string): Promise<string> => {
  try {
    const prompt = `Generate concise, easy-to-understand notes for a ${standard} student on the topic: "${topic}". 
    If an image is provided, use it as the primary context for generating the notes.
    The notes should include key definitions, important points in a list, and a brief explanation.
    The response must be in ${language} language.
    Format the response in Markdown, using headings, bold text, and bullet points.`;

    const parts: Part[] = [{ text: prompt }];
    if (imageBase64) {
        parts.push(imageToPart(imageBase64));
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating notes:", error);
    return "Sorry, I couldn't generate notes at the moment. Please try again.";
  }
};

export const generateQuiz = async (topic: string, imageBase64: string | null, language: string, standard: string): Promise<QuizQuestion[]> => {
    try {
        const prompt = `Generate a 5-question multiple-choice quiz on the topic '${topic}' for a ${standard} student.
            If an image is provided, use it as the primary context for generating the quiz.
            The questions and options should be in ${language}.
            The JSON structure should not contain any markdown.`

        const parts: Part[] = [{ text: prompt }];
        if (imageBase64) {
            parts.push(imageToPart(imageBase64));
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        questions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    },
                                    correctAnswer: { type: Type.STRING }
                                },
                                required: ["question", "options", "correctAnswer"]
                            }
                        }
                    }
                }
            },
        });

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);
        return parsedData.questions || [];

    } catch (error) {
        console.error("Error generating quiz:", error);
        return [];
    }
};

export const getAnswerForQnA = async (question: string, imageBase64: string | null, language: string, standard: string): Promise<string> => {
    try {
        const prompt = `You are an expert AI tutor for a ${standard} student. A student has asked the following question: "${question}".
        If an image is provided with the question, analyze it carefully as it's the main part of the question.
        Provide a clear, accurate, and step-by-step solution. 
        For numerical problems, show the calculations. For theoretical questions, explain the concept clearly.
        The response must be in the ${language} language.
        Format the entire response in Markdown.`;

        const parts: Part[] = [{ text: prompt }];
        if (imageBase64) {
            parts.push(imageToPart(imageBase64));
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts }
        });

        return response.text;
    } catch (error) {
        console.error("Error getting answer:", error);
        return "Sorry, I couldn't process your question at the moment. Please try again.";
    }
};


export const createChatSession = (language: string, standard: string): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are 'EduSarthi AI', a friendly and patient AI tutor for Indian school students in ${standard}. 
      Your goal is to help them understand their doubts about academic subjects. 
      You can also analyze images sent by the student.
      Explain concepts clearly and simply. Respond in ${language}. 
      If a user asks something unrelated to academics, politely steer the conversation back to studies.`,
    },
  });
};