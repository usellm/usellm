"use client";
import { createContext, createElement } from "react";

interface LLMContextValue {
  serviceUrl?: string;
}

export const LLMContext = createContext<LLMContextValue>({});

export function LLMProvider({
  children,
  serviceUrl,
}: LLMContextValue & { children: React.ReactNode }) {
  return createElement(
    LLMContext.Provider,
    { value: { serviceUrl } },
    children
  );
}
