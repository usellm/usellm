"use client";
import { useRouter } from "next/navigation";

export default function DemoPage() {
  const router = useRouter();
  router.push("/demo/ai-chatbot");
  return null;
}
