"use client";
import useLLM from "usellm";
import React, { useState } from "react";

export default function EmbedDemoPage() {
  const [documentText, setDocumentText] = useState("");
  const [question, setQuestion] = useState("");
  const llm = useLLM({ serviceUrl: "https://usellm.org/api/llm" });

  async function handleSubmit() {
    const paragraphs = documentText.split("\n").filter((p) => p.length > 0);
    const { embeddings: docEmbeddings } = await llm.embed({
      input: paragraphs,
    });
    const { embeddings: queryEmbeddings } = await llm.embed({
      input: question,
    });

    // Calculate similarity between the first paragraph and the query
    const similarity = llm.cosineSimilarity(
      docEmbeddings[0]["embedding"],
      queryEmbeddings[0]["embedding"]
    );
    console.log("Cosine similarity: ", similarity);
  }

  return (
    <div style={{ padding: 8 }}>
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
      <button onClick={handleSubmit}>Calculate similarity</button>
    </div>
  );
}
