import { MainNavItem, SidebarNavItem } from "@/types/nav";

interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/",
    },
    {
      title: "GitHub",
      href: "https://github.com/usellm/usellm",
      external: true,
    },
    {
      title: "Blog",
      href: "https://usellm.substack.com",
      external: true,
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Quickstart",
          href: "/docs",
        },
        {
          title: "Installation",
          href: "/docs/installation",
        },
      ],
    },
    {
      title: "Client-Side Usage",
      items: [
        {
          title: "`useLLM`",
          href: "/docs/api-reference/usellm-hook",
        },
        {
          title: "`.chat`",
          href: "/docs/api-reference/chat",
        },
        {
          title: "`.record`",
          href: "/docs/api-reference/record",
        },
        {
          title: "`.transcribe`",
          href: "/docs/api-reference/transcribe",
        },
        {
          title: "`.speak`",
          href: "/docs/api-reference/speak",
        },
        {
          title: "`.embed`",
          href: "/docs/api-reference/embed",
        },
        {
          title: "`.scoreEmbeddings`",
          href: "/docs/api-reference/scoreEmbeddings",
        },
        {
          title: "`.cosineSimilarity`",
          href: "docs/api-reference/cosineSimilarity",
        },
      ],
    },
    {
      title: "Server-Side Usage",
      items: [
        {
          title: "`createLLMService`",
          href: "/docs/api-reference/create-llm-service",
        },
        {
          title: "`.registerTemplate`",
          href: "/docs/api-reference/register-template",
        },
        {
          title: "`.handle`",
          href: "/docs/api-reference/llmservice-handle",
        },
      ],
    },
    {
      title: "Guides",
      items: [
        {
          title: "Message Streaming",
          href: "/docs/guides/message-streaming",
          label: "Soon",
          disabled: true,
        },
        {
          title: "Audio Transcription",
          href: "/docs/guides/audio-transcription",
          label: "Soon",
          disabled: true,
        },
        {
          title: "Prompt Engineering",
          href: "/docs/guides/prompt-engineering",
          label: "Soon",
          disabled: true,
        },
        {
          title: "Conversation History",
          href: "/docs/guides/conversation-history",
          label: "Soon",
          disabled: true,
        },
        {
          title: "Prompt Suggestion",
          href: "/docs/guides/next-prompt-suggestion",
          label: "Soon",
          disabled: true,
        },
        {
          title: "Document Embedding",
          href: "/docs/guides/embedding-documents",
          label: "Soon",
          disabled: true,
        },
        {
          title: "User Authentication",
          href: "/docs/guides/user-authentication",
          label: "Soon",
          disabled: true,
        },
        {
          title: "Rate Limiting",
          href: "/docs/guides/rate-limiting",
          label: "Soon",
          disabled: true,
        },
      ],
    },
    {
      title: "Examples",
      items: [
        {
          title: "Next.js (Pages Router)",
          href: "/docs/examples/nextjs-pages-router",
          label: "Soon",
          disabled: true,
        },
        {
          title: "Next.js (App Router)",
          href: "/docs/examples/nextjs-app-router",
          label: "Soon",
          disabled: true,
        },
        {
          title: "Android/iOS App",
          href: "/docs/examples/react-native-android-ios",
          label: "Soon",
          disabled: true,
        },
        {
          title: "Chrome Extension",
          href: "/docs/examples/chrome-extension",
          label: "Soon",
          disabled: true,
        },
        {
          title: "Slack Bot",
          href: "/docs/examples/slack-bot",
          label: "Soon",
          disabled: true,
        },
        {
          title: "Discord Bot",
          href: "/docs/examples/discord-bot",
          label: "Soon",
          disabled: true,
        },
      ],
    },
    {
      title: "Contribute",
      items: [
        {
          title: "Contribution Guide",
          href: "/docs/contribute/contribution-guide",
        },
        {
          title: "Publishing to NPM",
          href: "/docs/contribute/publishing-to-npm",
          label: "Soon",
          disabled: true,
        },
        {
          title: "Credits",
          href: "/docs/contribute/credits",
          label: "Soon",
          disabled: true,
        },
      ],
    },
  ],
};
