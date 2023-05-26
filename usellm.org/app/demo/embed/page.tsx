"use client";
import useLLM from "usellm";
import React, { useState } from "react";

export default function EmbedDemoPage() {
  const [documentText, setDocumentText] = useState("");
  const [answer, setAnswer] = useState("");
  const llm = useLLM({ serviceUrl: "https://usellm.org/api/llm" });

  async function handleEmbedding() {
    const paragraphs = documentText.split("\n").filter((p) => p.length > 0);
    const { embeddings } = await llm.embed({ input: paragraphs });

    setAnswer(
      embeddings[0].slice(0, 10).toString() +
        "..." +
        `[${embeddings[0].length}]`
    );
  }

  return (
    <div style={{ padding: 8 }}>
      <textarea
        maxLength={2000}
        value={documentText}
        onChange={(e) => setDocumentText(e.target.value)}
        placeholder="Enter a document..."
      />
      <button onClick={handleEmbedding}>Generate Embeddings</button>
      <div>Answer:</div>
      <pre>{answer}</pre>
    </div>
  );
}
