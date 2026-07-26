"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { Message, Conversation } from "./types";
import { loadConversations, saveConversations, deleteConversation } from "./storage";
import { sendMessage } from "./api";

interface ChatState {
  conversations: Conversation[];
  currentId: string | null;
  isStreaming: boolean;
  error: string | null;
}

type Action =
  | { type: "SET_CONVERSATIONS"; conversations: Conversation[] }
  | { type: "SET_CURRENT"; id: string }
  | { type: "ADD_MESSAGE"; message: Message }
  | { type: "UPDATE_LAST_ASSISTANT"; content: string }
  | { type: "SET_STREAMING"; isStreaming: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "UPDATE_TITLE"; title: string }
  | { type: "DELETE_CONVERSATION"; id: string }
  | { type: "NEW_CONVERSATION" };

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case "SET_CONVERSATIONS":
      return { ...state, conversations: action.conversations };
    case "SET_CURRENT":
      return { ...state, currentId: action.id };
    case "ADD_MESSAGE": {
      const conversations = state.conversations.map((c) =>
        c.id === state.currentId
          ? { ...c, messages: [...c.messages, action.message], updatedAt: Date.now() }
          : c
      );
      return { ...state, conversations };
    }
    case "UPDATE_LAST_ASSISTANT": {
      const conversations = state.conversations.map((c) => {
        if (c.id !== state.currentId) return c;
        const messages = [...c.messages];
        const last = messages[messages.length - 1];
        if (last?.role === "assistant") {
          messages[messages.length - 1] = { ...last, content: last.content + action.content };
        }
        return { ...c, messages, updatedAt: Date.now() };
      });
      return { ...state, conversations };
    }
    case "SET_STREAMING":
      return { ...state, isStreaming: action.isStreaming };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "UPDATE_TITLE": {
      const conversations = state.conversations.map((c) =>
        c.id === state.currentId ? { ...c, title: action.title } : c
      );
      return { ...state, conversations };
    }
    case "DELETE_CONVERSATION": {
      const conversations = deleteConversation(action.id);
      const currentId = state.currentId === action.id
        ? conversations[conversations.length - 1]?.id ?? null
        : state.currentId;
      const newState = { ...state, conversations, currentId };
      if (!newState.currentId) {
        newState.currentId = createConversation(newState);
      }
      return newState;
    }
    case "NEW_CONVERSATION": {
      const id = crypto.randomUUID();
      const conv: Conversation = {
        id,
        title: "New chat",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const conversations = [conv, ...state.conversations];
      return { ...state, conversations, currentId: id, error: null };
    }
    default:
      return state;
  }
}

function createConversation(state: ChatState): string {
  const id = crypto.randomUUID();
  const conv: Conversation = {
    id,
    title: "New chat",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  state.conversations.unshift(conv);
  return id;
}

interface ChatContextValue {
  state: ChatState;
  currentConversation: Conversation | undefined;
  send: (content: string) => Promise<void>;
  deleteConv: (id: string) => void;
  newChat: () => void;
  selectConversation: (id: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    conversations: [],
    currentId: null,
    isStreaming: false,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const stored = loadConversations();
    if (stored.length === 0) {
      const id = crypto.randomUUID();
      const conv: Conversation = {
        id,
        title: "New chat",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      stored.push(conv);
      saveConversations(stored);
    }
    dispatch({ type: "SET_CONVERSATIONS", conversations: stored });
    if (!state.currentId && stored.length > 0) {
      dispatch({ type: "SET_CURRENT", id: stored[0].id });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state.conversations.length > 0) {
      saveConversations(state.conversations);
    }
  }, [state.conversations.length, state.conversations]);

  const currentConversation = state.conversations.find((c) => c.id === state.currentId);

  const send = useCallback(
    async (content: string) => {
      if (state.isStreaming || !state.currentId) return;

      dispatch({ type: "SET_ERROR", error: null });

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: Date.now(),
      };
      dispatch({ type: "ADD_MESSAGE", message: userMsg });

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };
      dispatch({ type: "ADD_MESSAGE", message: assistantMsg });
      dispatch({ type: "SET_STREAMING", isStreaming: true });

      const conv = state.conversations.find((c) => c.id === state.currentId);
      if (conv && conv.messages.length === 1) {
        const short = content.length > 50 ? content.slice(0, 50) + "…" : content;
        dispatch({ type: "UPDATE_TITLE", title: short });
      }

      try {
        const messages = [...(conv?.messages ?? []), userMsg];
        abortRef.current = new AbortController();
        const generator = sendMessage(messages);
        for await (const token of generator) {
          if (abortRef.current?.signal.aborted) break;
          dispatch({ type: "UPDATE_LAST_ASSISTANT", content: token });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        dispatch({ type: "SET_ERROR", error: message });
      } finally {
        dispatch({ type: "SET_STREAMING", isStreaming: false });
        abortRef.current = null;
      }
    },
    [state.isStreaming, state.currentId, state.conversations]
  );

  const deleteConv = useCallback((id: string) => {
    dispatch({ type: "DELETE_CONVERSATION", id });
  }, []);

  const newChat = useCallback(() => {
    dispatch({ type: "NEW_CONVERSATION" });
  }, []);

  const selectConversation = useCallback((id: string) => {
    dispatch({ type: "SET_CURRENT", id });
  }, []);

  return (
    <ChatContext.Provider
      value={{ state, currentConversation, send, deleteConv, newChat, selectConversation }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
