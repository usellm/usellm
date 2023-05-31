import useLLM from "@/usellm";

export default function LLMServiceProviderDemoPage() {
  const llm = useLLM();
  const [result, setResult] = useState("");

  async function handleClick() {
    try {
      const { message } = await llm.chat({
        messages: [{ role: "user", content: "What is a language model?" }],
        stream: true,
        onStream: ({ message }) => setResult(message.content),
      });
      setResult(message.content);
    } catch (error) {
      console.error("Something went wrong!", error);
    }
  }

  return (
    <div className="p-4">
      <button
        className="border p-2 bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 rounded w-20 mb-2"
        onClick={handleClick}
      >
        Send
      </button>
      <div style={{ whiteSpace: "pre-wrap" }}>{result}</div>
    </div>
  );
}
