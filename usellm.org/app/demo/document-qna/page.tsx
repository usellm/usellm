"use client";
import useLLM from "usellm";
import { useState } from "react";

const createPrompt = (paragraphs: string[], question: string) => `
Read the following paragraphs from a longer document and answer the question below.

--DOCUMENT BEGINS--

${paragraphs.join("\n\n")}

--DOCUMENT ENDS--

Question: ${question}
`;

export default function DocumentQna() {
  const [documentText, setDocumentText] = useState("");
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [documentEmbeddings, setDocumentEmbeddings] = useState<number[][]>([]);
  const [question, setQuestion] = useState("");
  const [matchedParagraphs, setMatchedParagraphs] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");

  const llm = useLLM({ serviceUrl: "/api/llm" });

  async function handleEmbedClick() {
    setStatus("Embedding...");
    if (!documentText) {
      window.alert("Please enter some text for the document!");
      return;
    }
    setDocumentEmbeddings([]);
    setQuestion("");
    setMatchedParagraphs([]);
    setAnswer("");
    const paragraphs = documentText
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
      .slice(0, 100)
      .map((p) => p.trim().substring(0, 1000));
    setParagraphs(paragraphs);
    const { embeddings } = await llm.embed({ input: paragraphs });
    setDocumentEmbeddings(embeddings);
    setStatus("");
  }

  async function handleSubmitClick() {
    setStatus("Answering...");
    setMatchedParagraphs([]);
    setAnswer("");
    if (!documentEmbeddings.length) {
      window.alert("Please embed the document first!");
      return;
    }

    if (!question) {
      window.alert("Please enter a question!");
      return;
    }

    const { embeddings } = await llm.embed({ input: question });
    const matchingParagraphs = llm
      .scoreEmbeddings({
        embeddings: documentEmbeddings,
        query: embeddings[0],
        top: 3,
      })
      .map(({ index }) => paragraphs[index]);
    setMatchedParagraphs(matchingParagraphs);

    const initialMessage = {
      role: "user",
      content: createPrompt(matchingParagraphs, question),
    };
    const { message } = await llm.chat({
      messages: [initialMessage],
      stream: true,
      onStream: ({ message }) => setAnswer(message.content),
    });
    setAnswer(message.content);
    setStatus("");
  }

  return (
    <div className="p-4 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Document Q&A</h2>
      <textarea
        className="p-2 border rounded mr-2 w-full block text-sm"
        rows={10}
        placeholder="Paste a long document here"
        value={documentText}
        onChange={(e) => setDocumentText(e.target.value)}
      />
      <div className="flex items-center">
        <button
          onClick={handleEmbedClick}
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 my-4"
        >
          Embed
        </button>
        {documentEmbeddings.length > 0 && (
          <div className="ml-2">
            {documentEmbeddings.length} paragraphs embedded
          </div>
        )}
      </div>

      <input
        value={question}
        className="p-2 border rounded w-full block"
        onChange={(e) => setQuestion(e.target.value)}
        type="text"
        placeholder="Enter a question about the document"
      />

      <button
        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 my-4"
        onClick={handleSubmitClick}
      >
        Submit
      </button>
      {matchedParagraphs.length > 0 && (
        <div className="my-4">
          <div className="text-lg font-medium">Matched Paragraphs</div>

          {matchedParagraphs.map((paragraph, idx) => (
            <p
              className="my-2 text-sm"
              key={`${idx}-${paragraph.substring(0, 10)}`}
            >
              {paragraph.substring(0, 100) + "..."}
            </p>
          ))}
        </div>
      )}
      {answer && (
        <div className="my-4">
          <div className="text-lg font-medium">Answer</div>
          <div>{answer}</div>
        </div>
      )}

      {status && <div>{status}</div>}

      {!status &&
        !documentText &&
        !answer &&
        matchedParagraphs.length === 0 && (
          <div className="prose dark:prose-invert mt-2">
            <div className="font-medium">How it Works</div>
            <ul>
              <li>
                The first 20 paragraphs of the document will be considered for
                embedding.
              </li>
              <li>
                In each paragraph, only the first 1000 characters will be
                considered for embedding.
              </li>
              <li>
                The question embedding will be used to find top 3 matching
                paragraphs using cosine similary
              </li>
              <li>
                Matching paragraphs will be passed along with the question to
                the OpenAI chat completions API to generate an answer.
              </li>
            </ul>
          </div>
        )}
    </div>
  );
}
