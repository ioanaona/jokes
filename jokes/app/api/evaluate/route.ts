import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export async function POST(req: Request) {
  console.log("Evaluate API called");
  
  try {
    const { prompt } = await req.json();
    console.log("Evaluation prompt:", prompt);

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert joke evaluator. Analyze jokes and provide clear, concise ratings and feedback.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      stream: true
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Evaluation API error:', error);
    return new Response('Error processing request', { status: 500 });
  }
}
