"use client";

import { OpenAIMessage, useChat } from "usellm";
import { useEffect, useRef } from "react";

export default function FunctionCalling() {
  const {
    isLoading,
    messages,
    sendMessage,
    callFunction,
    sendFunctionOutput,
    input,
    setInput,
  } = useChat({
    agent: "github-qna",
    initialMessages: [
      {
        role: "assistant",
        content:
          "I'm an AI chatbot than can connect to the GitHub API. Ask me question about a GitHub username!",
      },
    ],
  });

  async function handleCallClick(name: string, args: any) {
    const output = await callFunction({
      function: name,
      arguments: args,
    });
    await sendFunctionOutput({ function: name, output });
  }

  return (
    <div className="flex flex-col h-full max-h-[600px] overflow-y-hidden">
      <ChatMessages messages={messages} callFunction={handleCallClick} />
      <div className="w-full pb-4 flex px-4">
        <ChatInput
          placeholder={
            !isLoading ? "Type a message..." : "Wait for my response..."
          }
          text={input}
          setText={setInput}
          sendMessage={sendMessage}
          disabled={isLoading}
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

interface ChatMessagesProps {
  messages: OpenAIMessage[];
  callFunction: (name: string, args: any) => void;
}

function ChatMessages({ messages, callFunction }: ChatMessagesProps) {
  let messagesWindow = useRef<Element | null>(null);

  useEffect(() => {
    if (messagesWindow?.current) {
      messagesWindow.current.scrollTop = messagesWindow.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="w-full flex-1 overflow-y-auto px-4"
      ref={(el) => (messagesWindow.current = el)}
    >
      {messages.map((message, idx) => (
        <ChatMessage key={idx} message={message} callFunction={callFunction} />
      ))}
    </div>
  );
}

interface ChatMessageProps {
  message: OpenAIMessage;
  callFunction: (name: string, args: any) => void;
}

function ChatMessage({ message, callFunction }: ChatMessageProps) {
  const { role, content, function_call } = message;
  return (
    <div className="my-4">
      <div className="font-semibold text-gray-800 dark:text-white">
        {capitalize(role)}
      </div>
      {role === "function" ? (
        <>
          <div className="text-gray-600 dark:text-gray-200 whitespace-pre-wrap mt-1">
            {"Here's the result of the function call:"}
          </div>
          <div className="text-gray-600 dark:text-gray-200 whitespace-pre-wrap my-1 bg-gray-50 dark:bg-gray-950 p-2 rounded">
            <pre>
              <b>Result:</b> {content}
            </pre>
          </div>
          <div className="text-gray-600 dark:text-gray-200 whitespace-pre-wrap mt-1">
            {"I'll process it now and reply to your message..."}
          </div>
        </>
      ) : (
        <div className="text-gray-600 dark:text-gray-200 whitespace-pre-wrap mt-1">
          {content}
        </div>
      )}
      {function_call && (
        <>
          <div className="text-gray-600 dark:text-gray-200 whitespace-pre-wrap mt-1">
            I need to call a function! Please review & approve the function call
            to proceed:
          </div>
          <div className="text-gray-600 dark:text-gray-200 whitespace-pre-wrap my-1 bg-gray-50 dark:bg-gray-950 p-2 rounded">
            <pre>
              <b>Function:</b> {function_call.name}
            </pre>
            <pre>
              <b>Arguments:</b> {function_call.arguments}
            </pre>
          </div>
          <div>
            <button
              className="p-1 text-sm border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium"
              onClick={() =>
                callFunction(
                  function_call.name,
                  JSON.parse(function_call.arguments)
                )
              }
            >
              Call Function
            </button>
          </div>
        </>
      )}
    </div>
  );
}

interface ChatInputProps {
  placeholder: string;
  text: string;
  setText: (text: string) => void;
  sendMessage: () => void;
  disabled: boolean;
}

function ChatInput({
  placeholder,
  text,
  setText,
  sendMessage,
  disabled,
}: ChatInputProps) {
  return (
    <input
      className="p-2 border rounded w-full block dark:bg-gray-900 dark:text-white"
      type="text"
      placeholder={placeholder}
      value={text}
      disabled={disabled}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          sendMessage();
        }
      }}
    />
  );
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}
