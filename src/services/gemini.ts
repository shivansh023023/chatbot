import { GoogleGenerativeAI } from '@google/generative-ai';

// **SECURITY WARNING: Embedding your API key directly in client-side code is a security risk.**
// **DO NOT do this in production applications.**
const apiKey = 'AIzaSyB_I0YPXXBym9K5TEvCdiqPbpMRk9GX95o'; // Replace with your actual API key

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

export const initializeGemini = () => {
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

export const generateResponse = async (prompt: string): Promise<string> => {
  if (!model) {
    throw new Error('Gemini API not initialized. Please call initializeGemini() first.');
  }

  try {
    const result = await model.generateContent(`
      You are a cybersecurity training assistant. Your purpose is to help users learn about cybersecurity topics.
      Only answer questions related to cybersecurity, ethical hacking, encryption, phishing prevention, and incident response.
      If the question is not related to cybersecurity, politely decline to answer and remind the user that you're focused on cybersecurity topics.

      User question: ${prompt}
    `);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Error generating response:', error);

    if (error.message?.includes('404') || error.message?.includes('not found')) {
      throw new Error('Unable to access Gemini model. Please verify your API key is valid and has access to the Gemini Pro model.');
    } else if (error.message?.includes('403')) {
      throw new Error('Access denied. Please check if your API key has the necessary permissions.');
    }

    throw new Error('Failed to generate response. Please try again.');
  }
};

// Initialize Gemini when the module loads
initializeGemini();