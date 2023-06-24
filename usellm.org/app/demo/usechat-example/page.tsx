"use client";
import { useChat } from "usellm";

export default function Demo() {
  const { input, setInput, messages, sendMessage } = useChat({
    stream: true,
    initialMessages: [
      {
        role: "assistant",
        content:
          "I'm a chatbot powered by the ChatGPT API and developed using useLLM. Ask me anything!",
      },
    ],
  });

  return (
    <div className="flex flex-col h-full max-h-[600px] overflow-y-hidden">
      <div className="w-full flex-1 overflow-y-auto px-4">
        {messages.map((message, idx) => (
          <div className="my-4" key={idx}>
            <div className="font-semibold text-gray-800 dark:text-white">
              {message.role}
            </div>
            <div className="text-gray-600 dark:text-gray-200 whitespace-pre-wrap mt-1">
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full pb-4 flex px-4">
        <input
          className="p-2 border rounded w-full block dark:bg-gray-900 dark:text-white"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium ml-2"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
