/* To run this demo yourself:

1. Create a next Next.js app using our starter template by running the following terminal command:

    npx create-next-app my-usellm-app -e https://github.com/usellm/nextjs-starter-template
    cd my-usellm-app # enter the directory

2. Copy the source code of this file & paste it in `app/page.tsx` replacing existing code.
   You can use a code editor like VS Code (https://code.visualdudio.com) to edit the file.

3. Run the development server using `npm run dev` and open http://localhost:3000 in your browser.
   You will now be able to try out this demo. Make changes to the code to see the changes live.

4. (Optional) Replace the `serviceUrl` below with your own service URL for production use.
*/
"use client";
import { useState } from "react";
import useLLM from "usellm";

export default function PromptTemplate() {
  const llm = useLLM({
    serviceUrl: "https://usellm.org/api/llm", // For testing only. Follow this guide to create your own service URL: https://usellm.org/docs/api-reference/create-llm-service
  });

  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");

  const handleClick = () => {
    setResult("");
    llm.chat({
      template: "tutorial-generator",
      inputs: { topic },
      stream: true,
      onStream: ({ message }) => setResult(message.content),
    });
  };

  return (
    <div className="p-4 overflow-y-scroll">
      <h2 className="text-2xl font-semibold mb-4">Tutorial Generator</h2>
      <input
        className="p-2 border rounded mr-2 w-full mb-4 block dark:bg-gray-900 dark:text-white"
        type="text"
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button
        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium"
        onClick={handleClick}
      >
        Generate Tutorial
      </button>
      <div className="whitespace-pre-wrap my-4">{result}</div>
    </div>
  );
}
