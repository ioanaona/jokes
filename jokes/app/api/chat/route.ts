import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI();

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are a professional comedian hired to write a series of short jokes. The jokes should be funny, engaging, and tailored to the user's preferences. You should generate jokes based on the given topic, tone, and type. Topics include work, people, animals, and food. Tones include witty, silly, sarcastic, dark, and goofy. Types include puns, knock-knock jokes, and blonde jokes. Make sure each joke fits the selected topic, tone, and type appropriately.`,
      },
      ...messages,
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
