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
        {
          title: "Usage",
          href: "/docs/usage",
        },
      ],
    },
    {
      title: "API Reference",
      items: [
        {
          title: "`useLLM`",
          href: "/docs/api-reference/usellm-hook",
        },
        {
          title: "`createLLMService`",
          href: "/docs/api-reference/create-llm-service",
        },
        {
          title: "`llm.chat`",
          href: "/docs/api-reference/chat",
        },
        {
          title: "`llm.record`",
          href: "/docs/api-reference/record",
        },
        {
          title: "`llm.transcribe`",
          href: "/docs/api-reference/transcribe",
        },
        {
          title: "`registerTemplate`",
          href: "/docs/api-reference/register-template",
        },
      ],
    },
    {
      title: "Guides",
      items: [
        {
          title: "Message Streaming",
          href: "/docs/guides/message-streaming",
        },
        {
          title: "Audio Transcription",
          href: "/docs/guides/audio-transcription",
        },
        {
          title: "Prompt Engineering",
          href: "/docs/guides/prompt-engineering",
        },
        {
          title: "Conversation History",
          href: "/docs/guides/conversation-history",
        },
        {
          title: "Embedding Documents",
          href: "/docs/guides/embedding-documents",
        },
        {
          title: "User Authentication",
          href: "/docs/guides/user-authentication",
        },
        {
          title: "Rate Limiting",
          href: "/docs/guides/rate-limiting",
        },
      ],
    },
    {
      title: "Examples",
      items: [
        {
          title: "Next.js (Pages Router)",
          href: "/docs/examples/nextjs-pages-router",
        },
        {
          title: "Next.js (App Router)",
          href: "/docs/examples/nextjs-app-router",
        },
        {
          title: "React Native (Android/iOS)",
          href: "/docs/examples/react-native-android-ios",
        },
        {
          title: "Chrome Extension",
          href: "/docs/examples/chrome-extension",
        },
        {
          title: "Slack Bot",
          href: "/docs/examples/slack-bot",
        },
        {
          title: "Discord Bot",
          href: "/docs/examples/discord-bot",
        },
      ],
    },
    {
      title: "Contribute",
      items: [
        {
          title: "Development Setup",
          href: "/docs/contribute/development-setup",
        },
        {
          title: "Deployment & Publishing",
          href: "/docs/contribute/deployment-and-publishing",
        },
        {
          title: "Credits",
          href: "/docs/contribute/credits",
        },
      ],
    },
  ],
};
