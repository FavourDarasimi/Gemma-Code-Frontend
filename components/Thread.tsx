"use client";

import { useRef, useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useChat } from "@/lib/chat-store";
import { MessageUser } from "./MessageUser";
import { MessageAssistant } from "./MessageAssistant";
import { EmptyState } from "./EmptyState";

export function Thread() {
  const { currentConversation, send, state } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const messages = useMemo(
    () => currentConversation?.messages ?? [],
    [currentConversation?.messages]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggestion = (text: string) => {
    send(text);
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="max-w-[720px] mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-4">
        {messages.length === 0 ? (
          <EmptyState onSuggestionClick={handleSuggestion} />
        ) : (
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 8 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.001 : 0.15, ease: "easeOut" }}
              >
                {msg.role === "user" ? (
                  <MessageUser message={msg} />
                ) : (
                  <MessageAssistant
                    message={msg}
                    isStreaming={
                      state.isStreaming &&
                      i === messages.length - 1 &&
                      msg.content === ""
                    }
                  />
                )}
              </motion.div>
            ))}

            {state.isStreaming && messages[messages.length - 1]?.role === "assistant" && (
              <motion.div
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 8 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.001 : 0.15, ease: "easeOut" }}
              >
                <StreamingIndicator />
              </motion.div>
            )}

            {state.error && (
              <div className="flex gap-3">
                <div className="w-[2px] shrink-0 bg-danger rounded-none" />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-[500] text-danger leading-4 tracking-[0.04em] uppercase mb-2"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    error
                  </p>
                  <p className="text-[15px] leading-6 text-danger">
                    Couldn&apos;t reach the assistant. Check your connection and try again.
                  </p>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
}

function StreamingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-[2px] shrink-0 bg-accent rounded-none" />
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-[500] text-muted leading-4 tracking-[0.04em] uppercase mb-2"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          assistant
        </p>
        <span
          className="inline-block w-[2px] h-[18px]"
          style={{
            backgroundColor: "var(--color-accent)",
            animation: "gemmacode-blink 900ms linear infinite",
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
