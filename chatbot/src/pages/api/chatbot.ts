import type { NextApiRequest, NextApiResponse } from "next";
import Groq from "groq-sdk";
// Initialize OpenAI API client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send({ error: "Method Not Allowed" });
  }

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
            "You are an AI trained in Islamic knowledge. Only provide answers based on the Quran, Hadith, and scholarly interpretations. Avoid personal opinions.",
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
