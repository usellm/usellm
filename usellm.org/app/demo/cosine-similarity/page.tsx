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
    const { embeddings: docEmbeddings } = await llm.embed({
      input: paragraphs,
    });
    const { embeddings: queryEmbeddings } = await llm.embed({
      input: question,
    });

    // Calculate similarity between the first paragraph and the query
    const similarity = llm.cosineSimilarity(
      docEmbeddings[0],
      queryEmbeddings[0]
    );
    setAnswer(similarity.toString());
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
        style={{ display: "block" }}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about the document"
      />
      <button
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        onClick={handleSubmit}
      >
        Calculate similarity
      </button>
      <div>Answer:</div>
      <div>{answer}</div>
    </div>
  );
}
