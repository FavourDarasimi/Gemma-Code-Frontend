import { authFetch } from "./auth";

export type StreamEvent = {
  conversation_id?: string;
  title?: string;
  text?: string;
  error?: string;
  interrupted?: boolean;
};

export async function* sendMessage(
  backendConversationId: string | null,
  message: string
): AsyncGenerator<StreamEvent, void, unknown> {
  const res = await authFetch("/api/chat/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversation_id: backendConversationId,
      message,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || `Chat failed (${res.status})`);
  }

  yield* streamEvents(res);
}

export async function* continueMessage(
  backendConversationId: string
): AsyncGenerator<StreamEvent, void, unknown> {
  const res = await authFetch("/api/chat/continue/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversation_id: backendConversationId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || `Continue failed (${res.status})`);
  }

  yield* streamEvents(res);
}

async function* streamEvents(
  res: Response
): AsyncGenerator<StreamEvent, void, unknown> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let done = false;

  while (true) {
    const { done: streamDone, value } = await reader.read();
    if (streamDone) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") {
        done = true;
        return;
      }
      yield JSON.parse(data);
    }
  }

  if (!done) yield { interrupted: true };
}
