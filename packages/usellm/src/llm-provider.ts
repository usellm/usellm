import { createContext, createElement } from "react";

interface LLMContextValue {
  fetcher?: typeof fetch;
  serviceUrl?: string;
}

export const LLMContext = createContext<LLMContextValue>({
  fetcher: fetch,
});

interface LLMProviderProps extends LLMContextValue {
  children: React.ReactNode;
}

export function LLMProvider({
  children,
  fetcher,
  serviceUrl,
}: LLMProviderProps) {
  return createElement(
    LLMContext.Provider,
    { value: { fetcher, serviceUrl } },
    children
  );
}
