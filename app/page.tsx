"use client";

import { useChat } from "ai/react";
import { useRef,useState} from "react";
import OptionList from "./components/OptionList";
export default function Chat() {
  const { messages, isLoading, append } = useChat();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  function handleOptionSelect(option: string){
    setSelectedOption(option)
  }
 
  return (
    <div className="flex flex-col w-full h-screen max-w-md py-24 mx-auto stretch overflow-hidden">
      <div
        className="overflow-auto w-full mb-8"
        ref={messagesContainerRef}
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-green-700 p-3 m-2 rounded-lg"
                : "bg-slate-700 p-3 m-2 rounded-lg"
            }`}
          >
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end pr-4">
            <span className="animate-pulse text-2xl">...</span>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 w-full max-w-md">
        <div className="flex flex-col justify-center mb-2 items-center">
          {selectedOption && (
            <button
              className="bg-blue-500 p-2 text-white rounded shadow-xl"
              disabled={isLoading}
              onClick={() =>{
                append({
                  role: "user",
                  content: `Give me a joke with this topic ${selectedOption}`,
                });
                setSelectedOption(null);
              }}
            >
              Joke
            </button>
          )}
          <OptionList onSelect={handleOptionSelect} />
          
        </div>
      </div>
    </div>
  );
}