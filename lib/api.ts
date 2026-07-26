import type { Message } from "./types";

const MOCK_RESPONSES: Record<string, string> = {
  default: `Here's how you can implement that:

\`\`\`ts
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
\`\`\`

This recursive approach works for small values but gets expensive quickly. For larger inputs, consider memoization or iteration.

Let me know if you'd like to see an optimized version!`,
  bug: `Looking at this issue, the problem is likely a race condition in the async handler. Here's the fix:

\`\`\`ts
async function handleRequest(data: unknown) {
  const result = await validate(data);
  if (!result.ok) {
    throw new ValidationError(result.error);
  }
  return processResult(result.value);
}
\`\`\`

The key insight is that \`validate\` returns a discriminated union, not a thrown exception. Always check \`.ok\` before accessing \`.value\`.`,
  refactor: `Here's a cleaner approach using composition:

\`\`\`typescript
interface Transform<T, U> {
  (input: T): U;
}

function pipe<T, U, V>(
  fn1: Transform<T, U>,
  fn2: Transform<U, V>
): Transform<T, V> {
  return (input: T) => fn2(fn1(input));
}
\`\`\`

This makes the data flow explicit and testable. Each transformation becomes an independent unit.`,
};

const SENTENCE_DELAY_MS = 30;

export async function* sendMessage(
  messages: Message[]
): AsyncGenerator<string, void, unknown> {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() ?? "";
  let response = MOCK_RESPONSES.default;

  if (lastMessage.includes("bug") || lastMessage.includes("error") || lastMessage.includes("fix")) {
    response = MOCK_RESPONSES.bug;
  } else if (lastMessage.includes("refactor") || lastMessage.includes("clean") || lastMessage.includes("improve")) {
    response = MOCK_RESPONSES.refactor;
  }

  const words = response.split(/(?<=\s)/);
  for (const word of words) {
    await new Promise((r) => setTimeout(r, SENTENCE_DELAY_MS));
    yield word;
  }
}

export async function sendMessageStream(
  messages: Message[],
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
): Promise<void> {
  try {
    const generator = sendMessage(messages);
    for await (const token of generator) {
      onToken(token);
    }
    onDone();
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}
