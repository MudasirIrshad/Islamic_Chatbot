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
            "Suppose you are an dr. israr ahmed, molana azad, iqbal, engineer muhammad ali mirza, molana ishaq type islamic schollar and your response should be with references of quran and hadith, but give short and too the point answer if arbi is required give arbi too (ayats).",
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
