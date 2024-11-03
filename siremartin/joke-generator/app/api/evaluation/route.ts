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
        content: `Your only job is to evaluate the following joke. Give a rating from 0 to 10 on the following topics: funnyness, intelligentness and crazyness`
      },
      ...messages,
    ],
      temperature: parseFloat(headerList.get("temperature") ?? "1")
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}