import AIChatBot from "@/app/demo/ai-chatbot/page";
import DocumentQna from "@/app/demo/document-qna/page";
import ImageGeneration from "@/app/demo/image-generation/page";
import PromptTemplate from "@/app/demo/prompt-template/page";
import SpeechToText from "@/app/demo/speech-to-text/page";
import TextToSpeech from "@/app/demo/text-to-speech/page";
import VoiceChat from "@/app/demo/voice-chat/page";
import CloneVoice from "@/app/demo/clone-voice/page";
import FunctionCalling from "@/app/demo/function-calling/page";
import ImageCaptioning from "@/app/demo/image-captioning/page";
import SpeakMultilingual from "@/app/demo/speak-multilingual/page";

export const HOME_PAGE_DEMOS = [
  {
    name: "AI Chatbot",
    id: "ai-chatbot",
    component: AIChatBot,
    sourceUrl:
      "https://github.com/usellm/usellm/blob/main/usellm.org/app/demo/ai-chatbot/page.tsx",
  },
  {
    name: "Function Calling",
    id: "function-calling",
    component: FunctionCalling,
    sourceUrl:
      "https://github.com/usellm/usellm/blob/main/usellm.org/app/demo/function-calling/page.tsx",
  },
  {
    name: "Document Q&A",
    id: "document-qna",
    component: DocumentQna,
    sourceUrl:
      "https://github.com/usellm/usellm/blob/main/usellm.org/app/demo/document-qna/page.tsx",
  },
  {
    name: "Prompt Engineering",
    id: "prompt-template",
    component: PromptTemplate,
    sourceUrl:
      "https://github.com/usellm/usellm/blob/main/usellm.org/app/demo/prompt-template/page.tsx",
  },
  {
    name: "Speech to Text",
    id: "speech-to-text",
    component: SpeechToText,
    sourceUrl:
      "https://github.com/usellm/usellm/blob/main/usellm.org/app/demo/speech-to-text/page.tsx",
  },
  {
    name: "Text to Speech",
    id: "text-to-speech",
    component: TextToSpeech,
    sourceUrl:
      "https://github.com/usellm/usellm/blob/main/usellm.org/app/demo/text-to-speech/page.tsx",
  },
  {
    name: "Voice Chat",
    id: "voice-chat",
    component: VoiceChat,
    sourceUrl:
      "https://github.com/usellm/usellm/blob/main/usellm.org/app/demo/voice-chat/page.tsx",
  },
  {
    name: "Image Generation",
    id: "image-generation",
    component: ImageGeneration,
    sourceUrl:
      "https://github.com/usellm/usellm/blob/main/usellm.org/app/demo/image-generation/page.tsx",
  },
  {
    name: "Image Captioning",
    id: "image-captioning",
    component: ImageCaptioning,
    sourceUrl:
      "https://github.com/usellm/usellm/blob/main/usellm.org/app/demo/image-captioning/page.tsx",
  },
  {
    name: "Voice Cloning",
    id: "voice-cloning",
    component: CloneVoice,
    sourceUrl:
      "https://github.com/usellm/usellm/blob/main/usellm.org/app/demo/clone-voice/page.tsx",
  },
  {
    name: "Speak Multilingual",
    id: "speak-multilingual",
    component: SpeakMultilingual,
    sourceUrl:
      "https://github.com/usellm/usellm/blob/main/usellm.org/app/demo/speak-multilingual/page.tsx"
  },
];
