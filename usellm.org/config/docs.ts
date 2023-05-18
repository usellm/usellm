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
          items: [],
        },
        {
          title: "Installation",
          href: "/docs/installation",
          items: [],
        },
        {
          title: "Usage",
          href: "/docs/usage",
          items: [],
        },
      ],
    },
    {
      title: "API Reference",
      items: [
        {
          title: "useLLM Hook",
          href: "/docs/api-reference/usellm-hook",
          items: [],
        },
        {
          title: "createLLMService",
          href: "/docs/api-reference/create-llm-service",
          items: [],
        },
        {
          title: "registerTemplate",
          href: "/docs/api-reference/register-template",
          items: [],
        },
      ],
    },
    {
      title: "Guides",
      items: [
        {
          title: "Message Streaming",
          href: "/docs/guides/message-streaming",
          items: [],
        },
        {
          title: "Prompt Engineering",
          href: "/docs/guides/prompt-engineering",
          items: [],
        },
        {
          title: "Conversation History",
          href: "/docs/guides/conversation-history",
          items: [],
        },
        {
          title: "Embedding Documents",
          href: "/docs/guides/embedding-documents",
          items: [],
        },
        {
          title: "User Authentication",
          href: "/docs/guides/user-authentication",
          items: [],
        },
        {
          title: "Rate Limiting",
          href: "/docs/guides/rate-limiting",
          items: [],
        },
      ],
    },
    {
      title: "Examples",
      items: [
        {
          title: "Next.js (Pages Router)",
          href: "/docs/examples/nextjs-pages-router",
          items: [],
        },
        {
          title: "Next.js (App Router)",
          href: "/docs/examples/nextjs-app-router",
          items: [],
        },
        {
          title: "React Native (Android/iOS)",
          href: "/docs/examples/react-native-android-ios",
          items: [],
        },
        {
          title: "Chrome Extension",
          href: "/docs/examples/chrome-extension",
          items: [],
        },
        {
          title: "Slack Bot",
          href: "/docs/examples/slack-bot",
          items: [],
        },
        {
          title: "Discord Bot",
          href: "/docs/examples/discord-bot",
          items: [],
        },
      ],
    },
    {
      title: "Contribute",
      items: [
        {
          title: "Development Setup",
          href: "/docs/contribute/development-setup",
          items: [],
        },
        {
          title: "Deployment & Publishing",
          href: "/docs/contribute/deployment-and-publishing",
          items: [],
        },
        {
          title: "Credits",
          href: "/docs/contribute/credits",
          items: [],
        },
      ],
    },
  ],
};
