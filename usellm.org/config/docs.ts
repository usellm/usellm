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
      title: "Step-by-Step Tutorials",
      items: [
        {
          title: "Next.js (App Router)",
          href: "/docs/examples/nextjs-app-router",
          disabled: false,
        },
        {
          title: "Next.js (Pages Router)",
          href: "/docs/examples/nextjs-pages-router",
          disabled: false,
        },
        {
          title: "Android App",
          href: "/docs/examples/react-native-android",
        },
        {
          title: "Chrome Extension",
          href: "/docs/examples/chrome-extension",
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
          title: "`.voiceChat`",
          href: "/docs/api-reference/voiceChat",
        },
        {
          title: "`.embed`",
          href: "/docs/api-reference/embed",
        },
        {
          title: "`.generateImage`",
          href: "/docs/api-reference/generateImage",
        },
        {
          title: "`.imageVariation`",
          href: "/docs/api-reference/imageVariation",
        },
        {
          title: "`.scoreEmbeddings`",
          href: "/docs/api-reference/scoreEmbeddings",
        },
        {
          title: "`.cosineSimilarity`",
          href: "docs/api-reference/cosineSimilarity",
        },
        {
          title: "`.callAction`",
          href: "docs/api-reference/call-action",
        },
        {
          title: "`.callReplicate`",
          href: "docs/api-reference/call-replicate",
        },
        {
          title: "`<LLMProvider/>`",
          href: "docs/api-reference/llm-provider",
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
          title: "`.handle`",
          href: "/docs/api-reference/handle",
        },
        {
          title: "`.registerTemplate`",
          href: "/docs/api-reference/register-template",
        },
        {
          title: "`.registerAction`",
          href: "docs/api-reference/register-action",
        },
      ],
    },

    {
      title: "useLLM for Python",
      items: [
        {
          title: "Installation and Usage",
          href: "/docs/useLLM-py/installation-usage",
        },
        {
          title: "Classes and Methods",
          href: "/docs/useLLM-py/classes-methods",
        },
        {
          title: "Exceptions",
          href: "/docs/useLLM-py/exception",
        },
      ],
    },

    {
      title: "Live Demos",
      items: [
        {
          title: "AI Chatbot",
          href: "/demo/ai-chatbot",
        },
        {
          title: "Document Q&A",
          href: "/demo/document-qna",
        },
        {
          title: "Prompt Engineering",
          href: "/demo/prompt-template",
        },
        {
          title: "Speech to Text",
          href: "/demo/speech-to-text",
        },
        {
          title: "Text to Speech",
          href: "/demo/text-to-speech",
        },
        {
          title: "Voice Chat",
          href: "/demo/voice-chat",
        },
        {
          title: "Image Generation",
          href: "/demo/image-generation",
        },
      ],
    },
    {
      title: "Guides",
      items: [
        //     {
        //       title: "Message Streaming",
        //       href: "/docs/guides/message-streaming",
        //       label: "Soon",
        //       disabled: true,
        //     },
        //     {
        //       title: "Audio Transcription",
        //       href: "/docs/guides/audio-transcription",
        //       label: "Soon",
        //       disabled: true,
        //     },
        {
          title: "Prompt Engineering",
          href: "/docs/guides/prompt-engineering",
        },
        //     {
        //       title: "Conversation History",
        //       href: "/docs/guides/conversation-history",
        //       label: "Soon",
        //       disabled: true,
        //     },
        //     {
        //       title: "Prompt Suggestion",
        //       href: "/docs/guides/next-prompt-suggestion",
        //       label: "Soon",
        //       disabled: true,
        //     },
        //     {
        //       title: "Document Embedding",
        //       href: "/docs/guides/embedding-documents",
        //       label: "Soon",
        //       disabled: true,
        //     },
        //     {
        //       title: "User Authentication",
        //       href: "/docs/guides/user-authentication",
        //       label: "Soon",
        //       disabled: true,
        //     },
        //     {
        //       title: "Rate Limiting",
        //       href: "/docs/guides/rate-limiting",
        //       label: "Soon",
        //       disabled: true,
        //     },
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
