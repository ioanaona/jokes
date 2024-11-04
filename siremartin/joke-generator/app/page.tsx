"use client";

import { useState } from "react";
import { useChat } from "ai/react";

export default function Chat() {
  const genres = [
    { emoji: "🩳", value: "short" },
    { emoji: "👖", value: "long" },
  ];
  const tones = [
    { emoji: "😊", value: "happy" },
    { emoji: "😢", value: "sad" },
    { emoji: "😏", value: "sarcastic" },
    { emoji: "💀", value: "morbid" },
  ];

  const [temp, setTemp] = useState(1);

  const [state, setState] = useState({
    length: "",
    tone: "",
    temperature: 1,
  });

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleTempChange = (event: { target: { value: string; }; }) => {
    setTemp(parseFloat(event.target.value));
    setState({
      ...state,
      ["temperature"]: parseFloat(event.target.value)
    })
    console.log(`state: ${state.length} / ${state.tone} / ${state.temperature}`);
  }

  const { messages: jokeMessages, append: appendJoke, isLoading: isJokeLoading } = useChat();
  const { messages: evaluationMessages, append: appendEvaluation, isLoading: isEvaluationLoading } = useChat({
    api: '/api/evaluation'
  });

  return (
    <main className="mx-auto w-full p-24 flex flex-col">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2 d-flex justify-content-center border-2 border-dashed border-zinc-500 p-4 rounded-lg">
            <h2 className="text-3xl font-extrabold text-zinc-500 dark:text-zinc-400 text-center tracking-tight">Story Telling App</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-semibold tracking-wide">
              Customize the story by selecting the joke length, tone and temperature.
            </p>
          </div>

          <div className="w-[300px] p-6 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-xl shadow-lg">
            <div className="text-white text-xl font-bold flex justify-center mb-4">
              📝 Genre 📝
            </div>

            <div className="flex flex-wrap justify-center">
              {genres.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-2 m-1 bg-black/30 rounded-lg hover:opacity-80 transition-all duration-200 cursor-pointer"
                >
                  <input
                    id={value}
                    type="radio"
                    value={value}
                    name="length"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <label className="cursor-pointer px-2 py-1" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="w-[300px] p-6 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-xl shadow-lg">
            <div className="text-white text-xl font-bold flex justify-center mb-4">
              🎭 Tone 🎭
            </div>

            <div className="flex flex-wrap justify-center">
              {tones.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-2 m-1 bg-black/30 rounded-lg hover:opacity-80 transition-all duration-200 cursor-pointer"
                >
                  <input
                    id={value}
                    type="radio"
                    name="tone"
                    value={value}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <label className="cursor-pointer px-2 py-1" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="w-[300px] p-6 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-xl shadow-lg">
            <div className="text-white text-xl font-bold flex justify-center mb-4">
              🌡️ Temperature 🌡️
            </div>
            <div className="text-white flex justify-between mb-4 font-mono">
              <span className="bg-black/30 px-2 py-1 rounded">0</span>
              <span className="bg-black/30 px-3 py-1 rounded">Current: {temp}</span>
              <span className="bg-black/30 px-2 py-1 rounded">2</span>
            </div>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={temp}
              onChange={handleTempChange}
              className="w-full h-2 appearance-none bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg cursor-pointer 
              hover:opacity-80 transition-all duration-200
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-webkit-slider-thumb]:transition-all"
            />
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isJokeLoading || !state.length || !state.tone}
            onClick={() =>
              appendJoke({
                role: "user",
                content: `Generate a ${state.length} joke in a ${state.tone} tone`,
              }, {
                headers: {
                  "Temperature": `${state.temperature}`
                }
              })
            }
          >
            Generate a {state.length} {state.tone} joke (temperature: {temp})
          </button>

          <div
            hidden={
              jokeMessages.length === 0 ||
              jokeMessages[jokeMessages.length - 1]?.content.startsWith("Generate")
            }
            className="bg-opacity-25 bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 rounded-lg p-4"
          >
            {jokeMessages[jokeMessages.length - 1]?.content}
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={jokeMessages.length < 2 || isJokeLoading}
            onClick={() =>
              appendEvaluation({
                role: "user",
                content: `Evaluate the following joke "${jokeMessages[jokeMessages.length - 1].content}"`,
              }, {
                headers: {
                  "Temperature": `${state.temperature}`
                }
              })
            }
          >
            Evaluate Joke
          </button>

          <div
            hidden={
              evaluationMessages.length === 0 ||
              evaluationMessages[evaluationMessages.length - 1]?.content.startsWith("Evaluate")
            }
            className="bg-opacity-25 bg-gradient-to-r from-purple-700 via-pink-700 to-red-700 rounded-lg p-4"
          >
            {evaluationMessages[evaluationMessages.length - 1]?.content}
          </div>
        </div>
      </div>
    </main>
  );
}