import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { headers } from "next/headers"

const openai = new OpenAI();

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const headerList = await headers();
  console.log(`received temperature: ${headerList.get("temperature")}`);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      {
        role: "system",
        content: `Your only job is to tell jokes an be funny. A user can request a long or a short joke of a specific genre. The possible genres are happy, sad, sarcastic or morbid.`
      },
      ...messages,
    ],
      temperature: parseFloat(headerList.get("temperature") ?? "1")
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}