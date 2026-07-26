import type { Conversation } from "./types";

const STORAGE_KEY = "gemmacode-chats";

export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {}
}

export function deleteConversation(id: string): Conversation[] {
  const list = loadConversations().filter((c) => c.id !== id);
  saveConversations(list);
  return list;
}
