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
import useLLM from "usellm";
import { useState } from "react";

export default function TextToSpeech() {
  const [text, setText] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const llm = useLLM({
    serviceUrl: "https://usellm.org/api/llm", // For testing only. Follow this guide to create your own service URL: https://usellm.org/docs/api-reference/create-llm-service
  });

  async function handleSpeakClick() {
    if (!text) return;
    const { audioUrl } = await llm.speak({ text });
    setAudioUrl(audioUrl);
  }

  return (
    <div className="p-4 overflow-y-auto">
      <h2 className="font-semibold text-2xl">Text to Speech</h2>
      <textarea
        className="p-2 border rounded w-full block mt-4 dark:bg-gray-900 dark:text-white"
        placeholder="Enter some text here"
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium my-4"
        onClick={handleSpeakClick}
      >
        Speak It!
      </button>
      {audioUrl && <audio src={audioUrl} controls />}
    </div>
  );
}
