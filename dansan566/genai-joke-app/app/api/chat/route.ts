import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI();

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const lastMessage = messages[messages.length - 1];

  // Check if the last message is a joke generation request
  if (lastMessage.content.startsWith("Generate a")) {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You might need to adjust the model
      stream: true,
      messages: [
        {
          role: "system",
          content: `You are a professional joke generator. You can generate jokes based on different topics, tones, and types.`,
        },
        ...messages,
      ],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } else if (lastMessage.content.startsWith("Evaluate the following joke")) {
    // If the last message is an evaluation request, send a separate request
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You might need to adjust the model
      stream: true,
      messages: [
        {
          role: "system",
          content: `You are a professional joke evaluator. You can evaluate jokes based on criteria like funny, appropriate, and offensive.`,
        },
        ...messages,
      ],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } else {
    // Handle other types of messages or requests if needed
    return new Response("Invalid request", { status: 400 });
  }
}