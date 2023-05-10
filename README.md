# useLLM - Use Large Language Models in Your React App

`useLLM` is a React hook for integrating large language models like OpenAI's ChatGPT with just a few lines of code. It's a wrapper over [OpenAI's chat completions API](https://platform.openai.com/docs/api-reference/chat/create). Support for other language models and APIs will be added soon.

## Installation

Install the package from NPM:

```
npm install usellm@latest
```

## Usage

The libary offers the following functionality:

1. Use the `useLLM` hook in your react component (client-side)
2. Use `createLLMService` to create an API endpoint for the hook (server-side)
3. User `.registerTemplate` to set up preconfigured prompts & options (server-side


### `useLLM`

1. Initialize the hook with a Service URL inside a react component:

  ```javascript
  const llm = useLLM("https://usellm.org/api/llmservice");
  ```

  Check the next section to learn how you can create your own service URL.

2. Use the `.chat` method to send a chat message and provide `onSuccess` and `onError` callbacks:

```javascript
llm.chat({
  messages: [{ role: "user", content: "Who are you?" }],
  onSuccess: (message) => console.log(message);
  onError: (error) => console.error(error);
});
```

3. The `.chat` method also supports streaming the response token-by-token using the `onStream` callback:

```
llm.chat({
  messages: [{ role: "user", content: "Who are you?" }],
  stream: true,
  onStream: (message) => console.log(message);
  onError: (error) => console.error(error);
});
```

The `messages` option passed to `llm.chat` must be an array of OpenAI messages, as documented here: https://platform.openai.com/docs/api-reference/chat/create#chat/create-messages


Here's a complete working example that you can use as a starting point:


```javascript
import useLLM from 'usellm';

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
      <div>{result}</div>
    </div>
  );
}

```

It produces the following output:

<img src="https://github.com/usellm/usellm/assets/1560745/d4709dfa-9403-4845-9f76-2fa21667604a" alt="usellmdemo" width="320">

Here are the type signature showing the full set of options supported by `llm.chat`:

```
interface UseLLMChatOptions {
    messages?: OpenAIMessage[];     
    stream?: boolean;
    template?: string;
    inputs?: object;
    onStream?: (message: OpenAIMessage, isFirst: boolean, isLast: boolean) => void;
    onSuccess?: (message: OpenAIMessage) => void;
    onError?: (error: Error) => void;
}
```

`OpenAIMessage` has the following signature:

```
interface OpenAIMessage {
    content: string;
    role: string;
    user?: string;
}
```

Apart from a service URL, you can also provide a custom `fetcher` function to `useLLM` (it should have the same signature at `fetch`):

```
const llm = useLLM(serviceUrl, fetcher);
```

Check the [source code](https://github.com/usellm/usellm/blob/main/packages/usellm/src/usellm.ts) for more details.


### `createLLMService`

You'll need to provide an [API Key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) to user OpenAI APIs. This API key should be sent to the browser. To connect to the OpenAI API securely from your application, you can create an API endpoint that uses the `createLLMService` helper function from `usellm`.

1. Create the LLMService:

```javascript
const llmService = createLLMService({ openaiApiKey: process.env.OPENAI_API_KEY });
```

2. Store your OpenAI API key in an enviroment variable file (e.g. `.env.local` for [NextJS applications](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)):

```ini
OPENAI_API_KEY=xxxxxxxx
```

3. Use `llmService.handle` in a server-side API route:

```javascript
/* pages/api/llmservice.js */

export default async function handler(req, res) {
  
  // verify user authentication etc.

  const result = await llmService.handle(req.body);
  
  res.send(result);
}

```

Note: The above example uses [NextJS API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes). You may need to add additional logic to your API route (e.g. checking whether the user is logged in, rate limiting, etc.) before invoking `llmService.handle` to restrict access as per your application's needs.


4. Provide the API URL/path in the `useLLM` hook in your React component:

```
  const llm = useLLM("/api/llmservice");
```

**NOTE**: To stream messages in a NextJS application, you'll need to use the `edge` runtime.

If your using the `pages` folder for routing, here's an example [edge API route](https://nextjs.org/docs/pages/building-your-application/routing/api-routes#edge-api-routes) you can use as a starting point:

```javascript
/* pages/api/llmservice.ts */

import { createLLMService } from "usellm";

export const config = {
  runtime: 'edge',
};
 
const llmService = createLLMService({
  openaiApiKey: process.env.OPENAI_API_KEY,
});

export async function handler(request: Request) {
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

Here are the full set of options you can provide to `createLLMService`:

```
interface CreateLLMServiceArgs {
  openaiApiKey?: string;
  fetcher?: typeof fetch;  // provide a custom fetcher
  templates?: { [id: string]: LLMServiceTemplate };  // see next section
  debug?: boolean;  // logs the JSON body sent to OpenAI
}
```

Check the [source code](https://github.com/usellm/usellm/blob/main/packages/usellm/src/createLLMService.ts) for more details

### Contributing

The library is under active development. Please open an issue to report bugs and open a pull request to contribute new features.










