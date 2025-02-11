import { NextApiRequest, NextApiResponse } from "next";
import Groq from "groq-sdk";
// Initialize OpenAI API client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// pages/api/chatbot.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).send({ error: "Message parameter is required" });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "The AI should provide short, to-the-point answers based strictly on Qur'an and authentic Hadith (Sahih only) with proper references (e.g., Surah name & Ayah number for Qur'an, Bukhari, Muslim for Hadith). If Arabic is needed, include the original Ayah or Hadith text. Scholarly interpretations should be based on reliable scholars like Ibn Taymiyyah, Imam Abu Hanifa, or other classical scholars, without personal opinions. Responses should be clear, concise, and focused on Islamic teachings, avoiding unnecessary elaboration or controversial debates.",
        },
        { role: "user", content: message as string },
      ],
    });

    res.status(200).send({ answer: response.choices[0].message?.content });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to fetch response" });
  }
}
