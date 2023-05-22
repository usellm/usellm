"use client";
import useLLM from "usellm";
import React, { useState } from "react";

export default function EmbedDemoPage() {
  const [documentText, setDocumentText] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const llm = useLLM({ serviceUrl: "https://usellm.org/api/llm" });

  async function handleSubmit() {
    const paragraphs = documentText.split("\n").filter((p) => p.length > 0);
    const { embeddings } = await llm.embed({ input: paragraphs });
    const { embeddings: queryEmbeddings } = await llm.embed({
      input: question,
    });

    const top3paragraphs = llm
      .scoreEmbeddings({ embeddings, query: queryEmbeddings[0] })
      .slice(0, 3)
      .map(({ index }) => paragraphs[index])
      .join("\n\n");

    const prompt = `Answer this: ${question} \n\nUse this information:${top3paragraphs}`;
    const { message } = await llm.chat({
      messages: [{ role: "user", content: prompt }],
    });
    setAnswer(message.content);
  }

  return (
    <div>
      <textarea
        maxLength={2000}
        rows={10}
        value={documentText}
        onChange={(e) => setDocumentText(e.target.value)}
      />
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about the document"
      />
      <button onClick={handleSubmit}>Ask</button>
      <div>Answer:</div>
      <div>{answer}</div>
    </div>
  );
}
