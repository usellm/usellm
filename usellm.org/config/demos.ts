import AIChatBot from "@/app/demo/ai-chatbot/page";
import DocumentQna from "@/app/demo/document-qna/page";
import ImageGeneration from "@/app/demo/image-generation/page";
import PromptTemplate from "@/app/demo/prompt-template/page";
import SpeechToText from "@/app/demo/speech-to-text/page";
import TextToSpeech from "@/app/demo/text-to-speech/page";
import VoiceChat from "@/app/demo/voice-chat/page";

export const HOME_PAGE_DEMOS = [
  {
    name: "AI Chatbot",
    id: "ai-chatbot",
    component: AIChatBot,
    sourceUrl: "https://github.com/usellm/usellm/",
  },
  {
    name: "Document Q&A",
    id: "document-qna",
    component: DocumentQna,
    sourceUrl: "https://github.com/usellm/usellm/",
  },
  {
    name: "Prompt Engineering",
    id: "prompt-template",
    component: PromptTemplate,
    sourceUrl: "https://github.com/usellm/usellm/",
  },
  {
    name: "Speech to Text",
    id: "speech-to-text",
    component: SpeechToText,
    sourceUrl: "https://github.com/usellm/usellm/",
  },
  {
    name: "Text to Speech",
    id: "text-to-speech",
    component: TextToSpeech,
    sourceUrl: "https://github.com/usellm/usellm/",
  },
  {
    name: "Voice Chat",
    id: "voice-chat",
    component: VoiceChat,
    sourceUrl: "https://github.com/usellm/usellm/",
  },
  {
    name: "Image Generation",
    id: "image-generation",
    component: ImageGeneration,
    sourceUrl: "https://github.com/usellm/usellm/",
  },
];
