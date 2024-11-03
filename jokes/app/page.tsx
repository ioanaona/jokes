"use client";
import React, { useState, useEffect } from "react";
import { useChat, useCompletion } from "ai/react";

const topics = [
  { emoji: "🤓", value: "Work" },
  { emoji: "👨‍👩‍👧‍👦", value: "People" },
  { emoji: "🐶", value: "Animals" },
  { emoji: "🍔", value: "Food" }
];

const tones = [
  { emoji: "🤖", value: "Witty" },
  { emoji: "🤡", value: "Silly" },
  { emoji: "🤑", value: "Sarcastic" },
  { emoji: "🤫", value: "Dark" },
  { emoji: "🤠", value: "Goofy" }
];

const types = [
  { emoji: "🤣", value: "Pun" },
  { emoji: "🤣", value: "Knock-knock" },
  { emoji: "🤣", value: "Blonde" }
];

export default function Page() {
  const { messages, append, isLoading } = useChat();
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const { complete: evaluateJoke } = useCompletion({
    api: '/api/evaluate'
  });

  const [state, setState] = useState({
    genre: "",
    tone: "",
    type: ""
  });

  useEffect(() => {
    const evaluateLatestJoke = async () => {
      try {
        const joke = messages[messages.length - 1]?.content;
        
        // Only evaluate if it's a complete joke (ends with punctuation)
        if (joke && 
            !joke.startsWith("Generate") && 
            (joke.endsWith(".") || joke.endsWith("!") || joke.endsWith("?"))) {
          
          console.log("Evaluating complete joke:", joke);
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
        console.error("Error in evaluation:", error);
      }
    };

    
    if (messages.length > 0) {
      evaluateLatestJoke();
    }
  }, [messages, evaluateJoke]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="mx-auto w-full p-24 flex flex-col font-caveat">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Story Telling App</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Customize the joke by selecting the topic, tone and type.
            </p>
          </div>

          <div className="space-y-4 bg-opacity-35 bg-red-700 rounded-lg p-4">
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
                    name="genre"
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-opacity-35 bg-blue-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Tones</h3>
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
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-opacity-35 bg-purple-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Types</h3>
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
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isLoading || !state.genre || !state.tone || !state.type}
            onClick={async () => {
              // Reset previous evaluation
              setEvaluation(null);
              
              // Generate the joke
              await append({
                role: "user",
                content: `Generate a ${state.type} joke of the ${state.genre} genre in a ${state.tone} tone`
              });
            }}
          >
            Generate Joke
          </button>

          <div
            hidden={
              messages.length === 0 ||
              messages[messages.length - 1]?.content.startsWith("Generate")
            }
            className="bg-opacity-65 bg-green-700 rounded-lg p-4"
          >
            {messages[messages.length - 1]?.content}
          </div>

          {evaluation && (
            <div className="bg-opacity-65 bg-yellow-700 rounded-lg p-4 mt-4 text-white">
              <h3 className="text-xl font-semibold mb-2">Joke Evaluation:</h3>
              <div className="whitespace-pre-wrap">{evaluation}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}