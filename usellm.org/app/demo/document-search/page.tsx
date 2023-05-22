"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useLLM from "@/usellm";
import { useState } from "react";

interface Embedding {
  text: string;
  embedding: number[];
}

const createPrompt = (paragraphs: string[], question: string) => `

Read the following paragraphs from a longer document and answer the question below.

--DOCUMENT BEGINS--

${paragraphs.join("\n\n")}

--DOCUMENT ENDS--

Question: ${question}

`;

export default function DocumentSearchDemoPage() {
  const [documentText, setDocumentText] = useState("");
  const [documentEmbeddings, setDocumentEmbeddings] = useState<Embedding[]>([]); // [{ text: "", embedding: [] }
  const [question, setQuestion] = useState("");
  const [matchedParagraphs, setMatchedParagraphs] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");

  const llm = useLLM({ serviceUrl: "/api/llm" });

  async function handleEmbedClick() {
    const paragraphs = documentText
      .trim()
      .split("\n\n")
      .slice(0, 20)
      .map((p) => p.trim().substring(0, 1000));
    const { embeddings } = await llm.embed({ input: paragraphs });
    setDocumentEmbeddings(
      embeddings.map((data: { embedding: number[] }, idx: number) => ({
        text: paragraphs[idx],
        embedding: data.embedding,
      }))
    );
  }

  async function handleSubmitClick() {
    if (!question) {
      return;
    }
    const { embeddings } = await llm.embed({ input: question });
    const questionEmbedding = embeddings[0].embedding;

    const matchingEmbeddings = documentEmbeddings
      .map((embedding) => ({
        ...embedding,
        similarity: llm.cosineSimilarity(
          embedding.embedding,
          questionEmbedding
        ),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);

    const paragraphs = matchingEmbeddings.map((embedding) => embedding.text);
    setMatchedParagraphs(paragraphs);
    const initialMessage = {
      role: "user",
      content: createPrompt(paragraphs, question),
    };
    const { message } = await llm.chat({
      messages: [initialMessage],
      stream: true,
      onStream: ({ message }) => setAnswer(message.content),
    });
    setAnswer(message.content);
  }

  return (
    <div className="max-w-4xl w-full mx-auto p-4">
      <h1 className="my-4 text-3xl text-center font-bold">
        <code>llm.embed</code> - Document Q&A
      </h1>
      <Textarea
        rows={10}
        placeholder="Paste a long document here"
        value={documentText}
        onChange={(e) => setDocumentText(e.target.value)}
      />
      <div className="flex items-center">
        <Button className="my-4" onClick={handleEmbedClick}>
          Embed
        </Button>
        {documentEmbeddings.length > 0 && (
          <div className="ml-2">Paragraphs embedded</div>
        )}
      </div>

      <Input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        type="text"
        placeholder="Enter a question about the document"
      />

      <Button className="my-4" onClick={handleSubmitClick}>
        Submit
      </Button>
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

      {!answer && (
        <div className="prose">
          <div className="text-lg font-medium">How it Works</div>
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
              Matching paragraphs will be passed along with the question to the
              OpenAI chat completions API to generate an answer.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
