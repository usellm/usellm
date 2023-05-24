"use client";
import useLLM from "usellm";
import React, { useState } from "react";

export default function EmbedDemoPage() {
  const [documentText, setDocumentText] = useState("");
  const llm = useLLM({ serviceUrl: "https://usellm.org/api/llm" });

  async function handleEmbedding() {
    const paragraphs = documentText.split("\n").filter((p) => p.length > 0);
    const { embeddings } = await llm.embed({ input: paragraphs });

    // For illustration purpose, print the first embedding to the console
    console.log(
      "Embedding of the first paragraph: ",
      embeddings[0]["embedding"]
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
    </div>
  );
}
