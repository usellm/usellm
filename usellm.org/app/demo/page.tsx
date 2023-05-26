"use client";
import { useRouter } from "next/router";

export default function DemoPage() {
  const router = useRouter();
  router.push("/demo/ai-chatbot");
  return null;
}
