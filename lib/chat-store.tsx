"use client";

import { usePathname, useRouter } from "next/navigation";
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
import { loadConversations, saveConversations } from "./storage";
import { sendMessage, continueMessage } from "./api";
import { authFetch, getAccessToken } from "./auth";

interface ChatState {
  conversations: Conversation[];
  currentId: string | null;
  isStreaming: boolean;
  isContinuing: boolean;
  pendingContinue: boolean;
  error: string | null;
  messagesLoading: boolean;
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
  | { type: "NEW_CONVERSATION" }
  | { type: "SET_CONVERSATION_ID"; id: string }
  | { type: "SET_MESSAGES"; conversationId: string; messages: Message[] }
  | { type: "REMOVE_LAST_IF_EMPTY" }
  | { type: "SET_MESSAGES_LOADING"; loading: boolean }
  | { type: "SET_PENDING_CONTINUE"; pending: boolean }
  | { type: "SET_CONTINUING"; continuing: boolean };

function isIncompleteAssistant(messages: Message[]): boolean {
  const last = messages[messages.length - 1];
  return last?.role === "assistant" && last.complete === false;
}

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case "SET_CONVERSATIONS":
      return { ...state, conversations: action.conversations };
    case "SET_CURRENT": {
      const conv = state.conversations.find((c) => c.id === action.id);
      return {
        ...state,
        currentId: action.id,
        pendingContinue: conv ? isIncompleteAssistant(conv.messages) : false,
      };
    }
    case "ADD_MESSAGE": {
      const conversations = state.conversations.map((c) =>
        c.id === state.currentId
          ? { ...c, messages: [...c.messages, action.message], updatedAt: Date.now() }
          : c
      );
      return { ...state, conversations };
    }
    case "REMOVE_LAST_IF_EMPTY": {
      const conversations = state.conversations.map((c) => {
        if (c.id !== state.currentId) return c;
        const msgs = c.messages;
        const last = msgs[msgs.length - 1];
        if (last && last.role === "assistant" && !last.content) {
          return { ...c, messages: msgs.slice(0, -1), updatedAt: Date.now() };
        }
        return c;
      });
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
      const conversations = state.conversations.filter((c) => c.id !== action.id);
      saveConversations(conversations);
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
        saved: false,
      };
      const conversations = [conv, ...state.conversations];
      return {
        ...state,
        conversations,
        currentId: id,
        error: null,
        pendingContinue: false,
        isContinuing: false,
      };
    }
    case "SET_CONVERSATION_ID": {
      const newId = action.id;
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === state.currentId ? { ...c, id: newId, saved: true } : c
        ),
        currentId: newId,
      };
    }
    case "SET_MESSAGES": {
      const conversations = state.conversations.map((c) =>
        c.id === action.conversationId
          ? { ...c, messages: action.messages, updatedAt: Date.now() }
          : c
      );
      return {
        ...state,
        conversations,
        pendingContinue: isIncompleteAssistant(action.messages),
      };
    }
    case "SET_MESSAGES_LOADING":
      return { ...state, messagesLoading: action.loading };
    case "SET_PENDING_CONTINUE":
      return { ...state, pendingContinue: action.pending };
    case "SET_CONTINUING":
      return { ...state, isContinuing: action.continuing };
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
    saved: false,
  };
  state.conversations.unshift(conv);
  return id;
}

function backendMessageToMessage(bm: any): Message {
  return {
    id: String(bm.id),
    role: bm.role,
    content: bm.content,
    timestamp: Date.parse(bm.created_at),
    complete: bm.complete ?? true,
  };
}

function backendConversationToConversation(bc: any): Conversation {
  return {
    id: String(bc.id),
    title: bc.title,
    messages: (bc.messages || []).map(backendMessageToMessage),
    createdAt: Date.parse(bc.created_at),
    updatedAt: Date.parse(bc.updated_at),
    saved: true,
  };
}

function parseConversationIdFromPath(path: string): string | null {
  const match = path.match(/^\/chat\/([a-f0-9-]+)$/i);
  return match ? match[1] : null;
}

interface ChatContextValue {
  state: ChatState;
  currentConversation: Conversation | undefined;
  send: (content: string) => Promise<void>;
  continueReply: () => Promise<void>;
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
    isContinuing: false,
    pendingContinue: false,
    error: null,
    messagesLoading: false,
  });

  const abortRef = useRef<AbortController | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const initializedRef = useRef(false);

  const init = useCallback(async () => {
    const token = getAccessToken();
    const currentPath = pathnameRef.current;

    if (token) {
      try {
        const res = await authFetch("/api/conversations/");
        if (res.ok) {
          const data = await res.json();
          const backendConvs = data.map(backendConversationToConversation);

          const urlId = parseConversationIdFromPath(currentPath);
          let targetId: string | null = null;

          if (urlId) {
            const match = backendConvs.find((c: Conversation) => c.id === urlId);
            if (match) targetId = urlId;
          }

          if (!targetId) {
            if (backendConvs.length > 0) {
              targetId = backendConvs[0].id;
            } else {
              const newConv: Conversation = {
                id: crypto.randomUUID(),
                title: "New chat",
                messages: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
                saved: false,
              };
              backendConvs.push(newConv);
              targetId = newConv.id;
            }
          }

          dispatch({ type: "SET_CONVERSATIONS", conversations: backendConvs });
          saveConversations(backendConvs);

          const targetConv = backendConvs.find((c: Conversation) => c.id === targetId);
          if (targetConv?.saved) {
            dispatch({ type: "SET_MESSAGES_LOADING", loading: true });
          }

          dispatch({ type: "SET_CURRENT", id: targetId! });

          const targetPath = `/chat/${targetId}`;
          if (currentPath !== targetPath) {
            router.replace(targetPath);
          }

          if (targetConv?.saved) {
            try {
              const msgRes = await authFetch(`/api/conversations/${targetId}/`);
              if (msgRes.ok) {
                const msgData = await msgRes.json();
                const messages = (msgData.messages || []).map(backendMessageToMessage);
                dispatch({ type: "SET_MESSAGES", conversationId: targetId!, messages });
              }
            } catch {}
            dispatch({ type: "SET_MESSAGES_LOADING", loading: false });
          }

          initializedRef.current = true;
          return;
        }
      } catch {}
    }

    const stored = loadConversations();
    const urlId = parseConversationIdFromPath(currentPath);
    let targetId: string | null = null;

    if (urlId) {
      const match = stored.find((c) => c.id === urlId);
      if (match) targetId = urlId;
    }

    if (!targetId && stored.length > 0) {
      targetId = stored[0].id;
    }

    if (!targetId) {
      const id = crypto.randomUUID();
      const conv: Conversation = {
        id,
        title: "New chat",
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        saved: false,
      };
      stored.push(conv);
      saveConversations(stored);
      targetId = id;
    }

    dispatch({ type: "SET_CONVERSATIONS", conversations: stored });
    dispatch({ type: "SET_CURRENT", id: targetId! });

    const targetPath = `/chat/${targetId}`;
    if (currentPath !== targetPath) {
      router.replace(targetPath);
    }

    initializedRef.current = true;
  }, [router]);

  useEffect(() => {
    init();

    const onAuthChange = () => {
      init();
    };

    window.addEventListener("gemmacode-auth-change", onAuthChange);
    return () => window.removeEventListener("gemmacode-auth-change", onAuthChange);
  }, [init]);

  useEffect(() => {
    if (!initializedRef.current || !pathname.startsWith("/chat/")) return;
    const urlId = parseConversationIdFromPath(pathname);
    if (urlId && urlId !== state.currentId) {
      const conv = state.conversations.find((c) => c.id === urlId);
      if (conv) {
        dispatch({ type: "SET_CURRENT", id: urlId });
      }
    }
  }, [pathname]);

  // sync currentId to URL
  useEffect(() => {
    if (!initializedRef.current || !state.currentId) return;
    const targetPath = `/chat/${state.currentId}`;
    if (pathname !== targetPath) {
      router.replace(targetPath);
    }
  }, [state.currentId, pathname, router]);

  useEffect(() => {
    if (state.conversations.length > 0) {
      saveConversations(state.conversations);
    }
  }, [state.conversations.length, state.conversations]);

  const currentConversation = state.conversations.find((c) => c.id === state.currentId);

  const send = useCallback(
    async (content: string) => {
      if (state.isStreaming) return;

      let currentId = state.currentId;
      if (!currentId) {
        currentId = crypto.randomUUID();
        const conv: Conversation = {
          id: currentId,
          title: "New chat",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          saved: false,
        };
        dispatch({ type: "SET_CONVERSATIONS", conversations: [conv, ...state.conversations] });
        dispatch({ type: "SET_CURRENT", id: currentId });
      }

      dispatch({ type: "REMOVE_LAST_IF_EMPTY" });
      dispatch({ type: "SET_ERROR", error: null });
      dispatch({ type: "SET_PENDING_CONTINUE", pending: false });

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

      const conv = state.conversations.find((c) => c.id === currentId);
      if (conv && conv.messages.length === 0) {
        const short = content.length > 50 ? content.slice(0, 50) + "\u2026" : content;
        dispatch({ type: "UPDATE_TITLE", title: short });
      }

      const generator = sendMessage(conv?.saved ? currentId : null, content);
      try {
        abortRef.current = new AbortController();
        for await (const event of generator) {
          if (abortRef.current?.signal.aborted) break;
          if (event.conversation_id !== undefined) {
            dispatch({ type: "SET_CONVERSATION_ID", id: event.conversation_id });
            if (event.title !== undefined) {
              dispatch({ type: "UPDATE_TITLE", title: event.title });
            }
          }
          if (event.text !== undefined) {
            dispatch({ type: "UPDATE_LAST_ASSISTANT", content: event.text });
          }
          if (event.error !== undefined) {
            dispatch({ type: "SET_ERROR", error: event.error });
            dispatch({ type: "REMOVE_LAST_IF_EMPTY" });
          }
          if (event.interrupted) {
            dispatch({ type: "SET_PENDING_CONTINUE", pending: true });
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        dispatch({ type: "SET_ERROR", error: message });
        dispatch({ type: "REMOVE_LAST_IF_EMPTY" });
      } finally {
        dispatch({ type: "SET_STREAMING", isStreaming: false });
        abortRef.current = null;
      }
    },
    [state.isStreaming, state.currentId, state.conversations]
  );

  const continueReply = useCallback(async () => {
    if (state.isStreaming || state.isContinuing) return;

    const conv = state.conversations.find((c) => c.id === state.currentId);
    if (!conv) return;

    const last = conv.messages[conv.messages.length - 1];
    if (!last || last.role !== "assistant" || last.complete !== false) return;

    let backendId: string | null = conv.saved ? conv.id : null;
    if (!backendId) {
      try {
        const res = await authFetch("/api/conversations/");
        if (res.ok) {
          const list: any[] = await res.json();
          const firstUser = conv.messages.find((m) => m.role === "user")?.content ?? "";
          const expectedTitle = firstUser.slice(0, 40).trimEnd() || "New conversation";
          const match = list.find((c) => c.title === expectedTitle);
          if (match) {
            const detail = await authFetch(`/api/conversations/${match.id}/`);
            if (detail.ok) {
              const data = await detail.json();
              const msgs: any[] = data.messages || [];
              const candidate = msgs[msgs.length - 1];
              if (candidate?.role === "assistant" && candidate.complete === false) {
                backendId = String(match.id);
                dispatch({ type: "SET_CONVERSATION_ID", id: backendId });
              }
            }
          }
        }
      } catch {}
    }

    if (!backendId) {
      dispatch({ type: "SET_ERROR", error: "Couldn't resume this response. Try sending the message again." });
      return;
    }

    dispatch({ type: "SET_CONTINUING", continuing: true });
    dispatch({ type: "SET_PENDING_CONTINUE", pending: false });
    dispatch({ type: "SET_ERROR", error: null });

    try {
      const generator = continueMessage(backendId);
      for await (const event of generator) {
        if (event.text !== undefined) {
          dispatch({ type: "UPDATE_LAST_ASSISTANT", content: event.text });
        }
        if (event.error !== undefined) {
          dispatch({ type: "SET_ERROR", error: event.error });
          dispatch({ type: "SET_PENDING_CONTINUE", pending: true });
        }
        if (event.interrupted) {
          dispatch({ type: "SET_PENDING_CONTINUE", pending: true });
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      dispatch({ type: "SET_ERROR", error: message });
      dispatch({ type: "SET_PENDING_CONTINUE", pending: true });
    } finally {
      dispatch({ type: "SET_CONTINUING", continuing: false });
    }
  }, [state.isStreaming, state.isContinuing, state.currentId, state.conversations]);

  const deleteConv = useCallback(async (id: string) => {
    const conv = state.conversations.find((c) => c.id === id);
    if (conv?.saved) {
      try {
        await authFetch(`/api/conversations/${id}/`, {
          method: "DELETE",
        });
      } catch {}
    }
    dispatch({ type: "DELETE_CONVERSATION", id });
  }, [state.conversations]);

  const newChat = useCallback(async () => {
    const token = getAccessToken();
    if (token) {
      try {
        const res = await authFetch("/api/conversations/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "New chat" }),
        });
        if (res.ok) {
          const data = await res.json();
          const conv = backendConversationToConversation(data);
          dispatch({ type: "SET_CONVERSATIONS", conversations: [conv, ...state.conversations] });
          dispatch({ type: "SET_CURRENT", id: conv.id });
          router.push(`/chat/${conv.id}`);
          return;
        }
      } catch {}
    }

    dispatch({ type: "NEW_CONVERSATION" });
  }, [state.conversations, router]);

  const selectConversation = useCallback(
    async (id: string) => {
      const currentConv = state.conversations.find((c) => c.id === state.currentId);
      if (currentConv && !currentConv.saved && currentConv.messages.length === 0 && currentConv.id !== id) {
        dispatch({ type: "SET_CONVERSATIONS", conversations: state.conversations.filter(c => c.id !== currentConv.id) });
      }

      // fetch messages before switching to avoid blank flash
      const conv = state.conversations.find((c) => c.id === id);
      if (conv && conv.messages.length === 0 && conv.saved) {
        dispatch({ type: "SET_MESSAGES_LOADING", loading: true });
        try {
          const res = await authFetch(`/api/conversations/${id}/`);
          if (res.ok) {
            const data = await res.json();
            const messages = (data.messages || []).map(backendMessageToMessage);
            dispatch({ type: "SET_MESSAGES", conversationId: id, messages });
          }
        } catch {}
        dispatch({ type: "SET_MESSAGES_LOADING", loading: false });
      }

      dispatch({ type: "SET_CURRENT", id });
    },
    [state.conversations, state.currentId]
  );

  return (
    <ChatContext.Provider
      value={{ state, currentConversation, send, continueReply, deleteConv, newChat, selectConversation }}
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
