import * as dotenv from 'dotenv'
dotenv.config()


import { GoogleGenerativeAI } from "@google/generative-ai";

interface AIResponse {
    summary: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    suggestedAction: string;
}

const genAI = new GoogleGenerativeAI(
    process.env.GOOGLE_API_KEY as string,
);

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const processEventWithAI = async (text: string): Promise<AIResponse> => {
    const MAX_RETRIES = 3;
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
            const prompt = `
            You are a security analyst AI. Analyze the following security event text and provide a response in JSON format.
            Your response must be a JSON object with the following keys: "summary", "severity", and "suggestedAction".
            - "summary": A brief summary of the event.
            - "severity": Must be one of "LOW", "MEDIUM", "HIGH", or "CRITICAL".
            - "suggestedAction": A recommended action to take in response to the event.

            Security Event: "${text}"

            Provide only the JSON object in your response.
        `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const jsonContent = JSON.parse(response.text().replace(/```json\n|\n```/g, ''))
            console.log(`AI analysis successful after ${i + 1} attempt(s).`);
            return jsonContent as AIResponse;

        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i < MAX_RETRIES - 1) {
                // Wait for a few seconds before the next retry
                await delay(2000);
            }
        }
    }

    console.error("All AI analysis attempts failed. Returning a fallback response.");
    return {
        summary: "AI analysis failed.",
        severity: "LOW",
        suggestedAction: "Manual review is required."
    };
};