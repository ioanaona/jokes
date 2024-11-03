"use client";

import { useState } from "react";
import { useChat } from "ai/react";

export default function JokeGenerator() {
  const { messages, append, isLoading } = useChat();

  const topics = [
    { emoji: "💼", value: "Work" },
    { emoji: "🧑‍🤝‍🧑", value: "People" },
    { emoji: "🐶", value: "Animals" },
    { emoji: "🍕", value: "Food" },
    { emoji: "📺", value: "Television" },
  ];
  const tones = [
    { emoji: "😉", value: "Witty" },
    { emoji: "😏", value: "Sarcastic" },
    { emoji: "🤪", value: "Silly" },
    { emoji: "😈", value: "Dark" },
    { emoji: "😂", value: "Goofy" },
  ];
  const types = [
    { emoji: "❓", value: "Pun" },
    { emoji: "🚪", value: "Knock-knock" },
    { emoji: "📖", value: "Story" },
  ];

  const [state, setState] = useState({
    topic: "Work",
    tone: "Witty",
    type: "Pun",
    temperature: 0.5,
  });

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleTemperatureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState({
      ...state,
      temperature: parseFloat(event.target.value),
    });
  };

  const handleGenerateJoke = async () => {
    const jokePrompt = `Generate a ${state.tone} ${state.type} joke about ${state.topic} with a temperature of ${state.temperature}`;

    append({
      role: "user",
      content: jokePrompt,
    });

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: [{ role: "user", content: jokePrompt }] }),
    });

    const data = await response.json();

    append({
      role: "assistant",
      content: data.choices[0].message.content,
    });

    const evaluationPrompt = `Evaluate the following joke based on these criteria: funny, appropriate, offensive, and provide a brief explanation for each: "${data.choices[0].message.content}"`;
    append({
      role: "user",
      content: evaluationPrompt,
    });
  };

  return (
    <main className="mx-auto w-full p-24 flex flex-col">
      <div className="p-4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Joke Generator</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Customize the joke by selecting the parameters below.
            </p>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Topic</h3>
            <div className="flex flex-wrap justify-center">
              {topics.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    value={value}
                    name="topic"
                    onChange={handleChange}
                    checked={state.topic === value}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Tone</h3>
            <div className="flex flex-wrap justify-center">
              {tones.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="tone"
                    value={value}
                    onChange={handleChange}
                    checked={state.tone === value}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Type</h3>
            <div className="flex flex-wrap justify-center">
              {types.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    name="type"
                    value={value}
                    onChange={handleChange}
                    checked={state.type === value}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Temperature</h3>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={state.temperature}
              onChange={handleTemperatureChange}
              className="w-full"
            />
            <span>{state.temperature}</span>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isLoading}
            onClick={handleGenerateJoke}
          >
            Generate Joke
          </button>

          <div className="mt-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
              >
                {message.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}