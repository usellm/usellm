# useLLM - Use Large Language Models in Your React App

`useLLM` is a React hook for integrating large language models like OpenAI's ChatGPT with just a few lines of code. [Try Demo](https://usellm.org/demo)

## Installation

Install the package from NPM:

```bash
npm install usellm@latest
```

## Usage

The libary offers the following functionality:

1. Use the `useLLM` hook in your react component (client-side)
2. Use `createLLMService` to create an API endpoint for the hook (server-side)
3. User `.registerTemplate` to set up preconfigured prompts & options (server-side)

**NOTE**: This library is currently a wrapper over [OpenAI's chat completions API](https://platform.openai.com/docs/api-reference/chat/create). More language models and APIs will be added soon.

### Step 1 - `useLLM` hook

1. Initialize the hook with a Service URL inside a react component:

```javascript
const llm = useLLM("https://usellm.org/api/llmservice");
```

**NOTE**: The above service URL is for testing only. Check the next section to learn how you can create your own service URL.

2. Use the `.chat` method to send a chat message and provide `onSuccess` and `onError` callbacks:

```javascript
llm.chat({
  messages: [{ role: "user", content: "Who are you?" }],
  onSuccess: (message) => console.log(message),
  onError: (error) => console.error(error),
});
```

You can also `await` the response of `llm.chat`.

3. The `.chat` method also supports streaming the response token-by-token using the `onStream` callback:

```javascript
llm.chat({
  messages: [{ role: "user", content: "Who are you?" }],
  stream: true,
  onStream: (message) => console.log(message),
  onError: (error) => console.error(error),
});
```

The `messages` option passed to `llm.chat` must be an array of OpenAI messages, as documented here: https://platform.openai.com/docs/api-reference/chat/create#chat/create-messages

#### Example - `llm.chat`

Here's a complete working example that you can use as a starting point:

```javascript
"use client";
import useLLM from "usellm";
import { useState } from "react";

export default function MyComponent() {
  const llm = useLLM("https://usellm.org/api/llmservice");
  const [result, setResult] = useState("");

  const handleClick = () => {
    llm.chat({
      messages: [{ role: "user", content: "What is a language model?" }],
      stream: true,
      onStream: (message) => setResult(message.content),
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Send</button>
      <div style={{ whiteSpace: "pre-wrap" }}>{result}</div>
    </div>
  );
}
```

It produces the following output:

<img src="https://github.com/usellm/usellm/assets/1560745/d4709dfa-9403-4845-9f76-2fa21667604a" alt="usellmdemo" width="320">

View a live demo here: https://usellm.org/demo1

#### Options - `useLLM`

Here are the type signature showing the full set of options supported by `llm.chat`:

```javascript
interface UseLLMChatOptions {
  messages?: OpenAIMessage[]; // message history for generating the next message
  stream?: boolean; // do you want to stream the response token by token?
  template?: string; // use a preconfigured template (see the `registerTemplate` section)
  inputs?: object; // inputs to be provided to the preconfigured template (see the `registerTemplate` section)
  onStream?: (
    // called every time a new token is received (only if stream is true)
    message: OpenAIMessage,
    isFirst: boolean,
    isLast: boolean
  ) => void;
  onSuccess?: (message: OpenAIMessage) => void; // called when the message is received (only if stream is true)
  onError?: (error: Error) => void; // called if an error was thrown by the service URL
}
```

`OpenAIMessage` has the following signature:

```javascript
interface OpenAIMessage {
  content: string; // contains the actual text of the message
  role: string; // can be "system", "user", or "assistant"
  user?: string; // an optional user name/ID used by OpenAI for spam prevention
}
```

Apart from a service URL, you can also provide a custom `fetcher` function to `useLLM` (it should have the same signature at `fetch`):

```javascript
const llm = useLLM(serviceUrl, fetcher);
```

Check the [source code](https://github.com/usellm/usellm/blob/main/packages/usellm/src/usellm.ts) for more details.

### Step 2 - Service URL with `createLLMService`

Create your own service URL using the `createLLMService` function.

**Why?**: You'll need to provide an [API Key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) to use OpenAI APIs. This API key should NOT be sent to the browser. To connect to the OpenAI API securely from your application, you can create an API endpoint that uses the `createLLMService` helper function from `usellm`.

1. Create the LLMService:

```javascript
const llmService = createLLMService({
  openaiApiKey: process.env.OPENAI_API_KEY,
});
```

2. Store your OpenAI API key in an enviroment variable file (e.g. `.env.local` for [NextJS applications](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)):

```ini
OPENAI_API_KEY=xxxxxxxx
```

3. Use the `llmService.handle` method in a server-side API route:

```javascript
/* pages/api/llmservice.js */

export default async function handler(req, res) {
  // verify user authentication, rate limit etc.

  const result = await llmService.handle(req.body);

  res.send(result);
}
```

Note: The above example uses [NextJS API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes). You may need to add additional logic to your API route (e.g. checking whether the user is logged in, rate limiting, etc.) before invoking `llmService.handle` to restrict access as per your application's needs.

**TIP**: Use Upstash for rate limiting: https://upstash.com/blog/upstash-ratelimit

4. Provide the API URL/path in the `useLLM` hook in your React component:

```javascript
const llm = useLLM("/api/llmservice");
```

**NOTE**: To stream messages in a NextJS application, you'll need to use the `edge` runtime.

#### Example - `createLLMService`

If you're using the `pages` folder for routing, here's an example [edge API route](https://nextjs.org/docs/pages/building-your-application/routing/api-routes#edge-api-routes) you can use as a starting point:

```javascript
/* pages/api/llmservice.ts */

import { createLLMService } from "usellm";

export const config = {
  runtime: 'edge',
};

const llmService = createLLMService({
  openaiApiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(request: Request) {
  const body = await request.json();

  try {
    const data = await llmService.handle(body);
    return new Response(data, { status: 200 });
  } catch (error) {
    return new Response((error as Error).message, { status: 400 });
  }
}
```

If you're using the `app` folder for routing, here's an examle [edge route handler](https://nextjs.org/docs/app/building-your-application/routing/router-handlers#edge-and-nodejs-runtimes) you can use as a starting point:

```javascript
/* app/api/llmservice.ts */

import { createLLMService } from "usellm";

export const runtime = "edge";

const llmService = createLLMService({
  openaiApiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const data = await llmService.handle(body);
    return new Response(data, { status: 200 });
  } catch (error) {
    return new Response((error as Error).message, { status: 400 });
  }
}

```

#### Options - `createLLMService`

Here are the full set of options you can provide to `createLLMService`:

```javascript
interface CreateLLMServiceArgs {
  openaiApiKey?: string; // your OpenAI API Key (prefer passing this via an environment variable)
  fetcher?: typeof fetch; // provide a custom fetcher
  templates?: { [id: string]: LLMServiceTemplate }; // see next section
  debug?: boolean; // logs the JSON body sent to OpenAI
}
```

Here are the default options passed to the OpenAI API (see the next section for customization):

```javascript
const defaultTemplate = {
  model: "gpt-3.5-turbo",
  max_tokens: 200,
  temperature: 0.8,
};
```

Check the [source code](https://github.com/usellm/usellm/blob/main/packages/usellm/src/createLLMService.ts) for more details

### Step 3 - Prompt & Model Options with `registerTemplate`

To generate useful responses from large language models like OpenAI, you might need to customize the [options passed to the API](https://platform.openai.com/docs/api-reference/chat/create) (e.g. `model`, `max_tokens`, `temperature`) and create default prompts that provide instructions to the model to generate the desired results. To achieve this, you can create & register templates on the server using the `llmService.registerTemplate` method, and use registered templates from your react components.

1. Register a template using the `registerTemplate` method :

```javascript
llmService.registerTemplate({
  id: "jobot",
  systemPrompt:
    "Your name is Jobot! You have been developed by Jovian to help the world.",
  userPrompt: "Tell me about {{topic}}",
  model: "gpt-4",
  temperature: 0.8,
});
```

Note that you can provide two prompts within a template:

- `systemPrompt`: This is a system-level message that guides the behavior of the model throught the conversation. It is sent as `{"role": "system", "content": "..."}`.

- `userPrompt`: This is simply as the first message in the conversation, and is used to generate the first response. It is sent as `{"role": "user", "content": "..."}`.

Each prompt can contain variables e.g. `{{topic}}` whose values can be sent from the client (browser) using `llm.chat`.

2. Provide the template id and inputs in your react component while calling `llm.chat`:

```javascript
llm.chat({
  template: "jobot",
  inputs: { topic: "Machine Learning" },
  onSuccess: (message) => {
    console.log(message);
  },
});
```

If a `messages` argument is also provided to `llm.chat`, then the filled system and user prompts are simply added at the beginning of the list of provided messages.

Here are all the options supported for templates:

```javascript
interface LLMServiceTemplate {
  id: string; // unique identifier used while invoking the model from `llm.chat`
  systemPrompt?: string;
  userPrompt?: string;
  model?: string;
  temperature?: number;
  top_p?: number;
  n?: number;
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: number;
}
```

Check the [OpenAI API docs](https://platform.openai.com/docs/api-reference/chat/create) for information about each option and view the [source code](https://github.com/usellm/usellm/blob/main/packages/usellm/src/createLLMService.ts) for more details.

Check out this course on prompt engineering to craft effective prompts: https://learnprompting.org/docs/intro

#### Example - Template

Here's a complete example of a NextJS application that uses prompt templates:

```javascript
/* app/api/llmservice.tsx */

import { createLLMService } from "usellm";

export const runtime = "edge";

const llmService = createLLMService({
  openaiApiKey: process.env.OPENAI_API_KEY,
});

llmService.registerTemplate({
  id: "tutorial-generator",
  systemPrompt:
    "You job is to create a short tutorial on a given topic. Use simple words, avoid jargon. Start with an introduction, then provide a few points of explanation, and end with a conclusion",
  userPrompt: "Topic: {{topic}}",
  max_tokens: 1000,
  model: "gpt-4",
  temperature: 0.7,
});

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const data = await llmService.handle(body);
    return new Response(data, { status: 200 });
  } catch (error) {
    return new Response((error as Error).message, { status: 400 });
  }
}

```

```javascript
/* app/page.tsx */
"use client";
import { useState } from "react";
import useLLM from "usellm";

export default function HomePage() {
  const llm = useLLM("/api/llmservice");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");

  const handleClick = () => {
    llm.chat({
      template: "tutorial-generator",
      inputs: { topic },
      stream: true,
      onStream: (message) => setResult(message.content),
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button onClick={handleClick}>Send</button>
      <div style={{ whiteSpace: "pre-wrap" }}>{result}</div>
    </div>
  );
}
```

This produces the following result:

<img src="https://github.com/usellm/usellm/assets/1560745/3c75c050-692a-4d7f-8620-545b32b626da" width="420" alt="template demo" >

Check out a live demo here: https://usellm.org/demo2

## Contributing

The library is under active development. Please open an issue to report bugs and open a pull request to contribute new features.
