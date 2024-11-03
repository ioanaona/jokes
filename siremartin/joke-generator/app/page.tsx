"use client";

import { useState } from "react";
import { useChat } from "ai/react";

export default function Chat() {
  const genres = [
    { emoji: "🩳", value: "short" },
    { emoji: "👖", value: "long" },
  ];
  const tones = [
    { emoji: "😊", value: "Happy" },
    { emoji: "😢", value: "Sad" },
    { emoji: "😏", value: "Sarcastic" },
    { emoji: "😂", value: "Morbid" },
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

  const { messages, append, isLoading } = useChat();

  return (
    <main className="mx-auto w-full p-24 flex flex-col">
      <div className="p4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Story Telling App</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Customize the story by selecting the joke length, tone and temperature.
            </p>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold">Genre</h3>

            <div className="flex flex-wrap justify-center">
              {genres.map(({ value, emoji }) => (
                <div
                  key={value}
                  className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                >
                  <input
                    id={value}
                    type="radio"
                    value={value}
                    name="length"
                    onChange={handleChange}
                  />
                  <label className="ml-2" htmlFor={value}>
                    {`${emoji} ${value}`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
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

          <div style={{ width: '300px', padding: '20px' }}>
            <div style={{ color: "black", display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              Temperature: 
            </div>
            <div style={{ color: "black", display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>0</span>
              <span>Current: {temp}</span>
              <span>2</span>
            </div>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={temp}
              onChange={handleTempChange}
              style={{
                width: '100%',
                height: '4px',
                appearance: 'none',
                backgroundColor: '#ddd',
                outline: 'none',
                borderRadius: '2px',
                cursor: 'pointer'
              }}
            />
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isLoading || !state.length || !state.tone}
            onClick={() =>
              append({
                role: "user",
                content: `Generate a ${state.length} joke in a ${state.tone} tone`,
              }, {
                headers: {
                  "Temperature": `${state.temperature}`
                }
              })
            }
          >
            Generate Story
          </button>

          <div
            hidden={
              messages.length === 0 ||
              messages[messages.length - 1]?.content.startsWith("Generate")
            }
            className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
          >
            {messages[messages.length - 1]?.content}
          </div>
        </div>
      </div>
    </main>
  );
}