import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    candidateName: { type: Type.STRING, description: "The full name of the candidate found in the resume." },
    matchScore: { type: Type.NUMBER, description: "A score from 0 to 100 indicating how well the resume matches the job description." },
    matchedSkills: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of skills from the job description that the candidate possesses."
    },
    missingSkills: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of important skills from the job description that are missing or weak in the resume."
    },
    summary: { type: Type.STRING, description: "A brief professional summary of the candidate's suitability for the role." },
  },
  required: ["candidateName", "matchScore", "matchedSkills", "missingSkills", "summary"],
};

export const analyzeResume = async (jobDescription: string, file: File): Promise<AnalysisResult> => {
  const base64Data = await fileToBase64(file);
  
  // Strip the data URL prefix (e.g., "data:application/pdf;base64,")
  const base64Content = base64Data.split(',')[1];
  const mimeType = file.type;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        parts: [
          {
            text: `You are an expert HR Recruiter for Pristine Technologies. 
            Analyze the attached resume against the following Job Description. 
            
            Job Description:
            ${jobDescription}
            
            Provide a structured JSON response.`
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Content
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "Be critical and precise. High scores (80+) should only be given to near-perfect matches. Identify specific technical and soft skills.",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");

    const data = JSON.parse(text);
    return {
      ...data,
      filename: file.name
    };

  } catch (error) {
    console.error("Error analyzing resume:", error);
    // Fallback error result
    return {
      candidateName: "Unknown",
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
      summary: "Failed to analyze resume. Please check the file format and try again.",
      filename: file.name
    };
  }
};

export const createChatSession = (jobDescription: string, results: AnalysisResult[]): Chat => {
  const contextData = JSON.stringify(results.map(r => ({
    name: r.candidateName,
    score: r.matchScore,
    skills: r.matchedSkills,
    missing: r.missingSkills,
    summary: r.summary
  })), null, 2);

  return ai.chats.create({
    model: 'gemini-2.0-flash',
    config: {
      systemInstruction: `You are an expert HR Assistant for Pristine Technologies. 
      You have access to a list of candidates analyzed against a specific Job Description.
      
      Current Job Description:
      "${jobDescription.slice(0, 1000)}..." (truncated for brevity if too long)

      Analyzed Candidates Data:
      ${contextData}

      Your goal is to answer questions about these candidates, compare them, suggests who to interview, and explain why certain candidates received their scores. 
      Be professional, insightful, and helpful. If asked about data not present, say you don't have that information.`,
    }
  });
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};