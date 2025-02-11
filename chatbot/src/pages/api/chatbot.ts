import { NextApiRequest, NextApiResponse } from "next";
import Groq from "groq-sdk";
import Cors from "cors";

// Initialize OpenAI API client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Initialize CORS middleware
const cors = Cors({
  methods: ["POST"],
  origin: "*", // This allows all origins. You can change this to a specific domain for more security.
});

// Helper function to run the middleware
const runCors = (req: NextApiRequest, res: NextApiResponse) =>
  new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        reject(result);
      } else {
        resolve(result);
      }
    });
  });

// pages/api/chatbot.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runCors(req, res); // Ensure CORS runs before handling the request

  if (req.method == "POST") {
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
  } else {
    res.status(405).send({ error: "Method Not Allowed" });
  }
}
