export default function Navbar() {
  return (
    <div className="w-full shadow">
      <div className="w-full max-w-4xl px-4 h-14 flex items-center mx-auto justify-between">
        <span className="text-lg font-bold">useLLM</span>
        <a
          target="_blank"
          className="hover:text-blue-600"
          href="https://github.com/usellm/usellm"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
