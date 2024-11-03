"use client";
import { useState } from "react";
import { useChat, useCompletion } from "ai/react";

const topics = [
  { emoji: "🤓", value: "Work" },
  { emoji: "👨‍👩‍👧‍👦", value: "People" },
  { emoji: "🐶", value: "Animals" },
  { emoji: "🍔", value: "Food" },
];

const tones = [
  { emoji: "🤖", value: "Witty" },
  { emoji: "🤡", value: "Silly" },
  { emoji: "🤑", value: "Sarcastic" },
  { emoji: "🤫", value: "Dark" },
  { emoji: "🤠", value: "Goofy" },
];

const types = [
  { emoji: "🤣", value: "Pun" },
  { emoji: "🤣", value: "Knock-knock" },
  { emoji: "🤣", value: "Blonde" },
];

export default function Page() {
  const { messages, append, isLoading } = useChat();
  const [evaluation, setEvaluation] = useState(null);
  const { complete: evaluateJoke } = useCompletion({
    api: '/api/evaluate',
  });

  const [state, setState] = useState({
    genre: "",
    tone: "",
    type: "",
  });

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleGenerateJoke = async () => {
    try {
      await append({
        role: "user",
        content: `Generate a ${state.type} joke of the ${state.genre} genre in a ${state.tone} tone`
      });

      const joke = messages[messages.length - 1]?.content;
      if (joke && !joke.startsWith("Generate")) {
        const evaluationPrompt = `Analyze this joke and provide ratings (1-10) for:
- Humor Level (1 = not funny, 10 = hilarious)
- Appropriateness (1 = family-friendly, 10 = adult)
- Originality (1 = common, 10 = unique)
Also mention if it could be considered offensive.

Joke: "${joke}"`;
        
        const evaluation = await evaluateJoke(evaluationPrompt);
        setEvaluation(evaluation);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }; // Make sure this semicolon is here