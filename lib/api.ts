import { getAccessToken } from "./auth";

export async function* sendMessage(
  backendConversationId: string | null,
  message: string
): AsyncGenerator<{ conversation_id?: string; title?: string; text?: string; error?: string }, void, unknown> {
  const token = getAccessToken();

  const res = await fetch("/api/chat/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      conversation_id: backendConversationId,
      message,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || `Chat failed (${res.status})`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") return;
      yield JSON.parse(data);
    }
  }
}
