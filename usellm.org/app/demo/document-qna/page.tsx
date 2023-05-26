"use client";
import DocumentQnaDemo from "@/components/demos/document-qna-demo";

export default function DocumentQnaPage() {
  return (
    <div className="max-w-4xl w-full mx-auto p-4">
      <h1 className="my-4 text-3xl text-center font-bold">
        <code>llm.embed</code> - Document Q&A
      </h1>
      <DocumentQnaDemo />
    </div>
  );
}
