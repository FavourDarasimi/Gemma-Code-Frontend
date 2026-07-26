"use client";

import { useMemo } from "react";
import type { Message } from "@/lib/types";
import { CodeBlock } from "./CodeBlock";

interface MessageAssistantProps {
  message: Message;
  isStreaming?: boolean;
}

function parseContent(content: string) {
  const parts: { type: "text" | "code"; content: string; language?: string }[] = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: content.slice(lastIndex, match.index) });
    }
    const language = match[1] || "text";
    const code = match[2].replace(/\n$/, "");
    parts.push({ type: "code", content: code, language });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", content: content.slice(lastIndex) });
  }

  return parts;
}

export function MessageAssistant({ message, isStreaming }: MessageAssistantProps) {
  const parts = useMemo(() => parseContent(message.content), [message.content]);

  return (
    <div className="flex-1 min-w-0">
        <p
          className="text-xs font-[500] text-muted leading-4 tracking-[0.04em] uppercase mb-2"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          assistant
        </p>
        <div className="space-y-3">
          {parts.map((part, i) => {
            if (part.type === "code") {
              return <CodeBlock key={i} language={part.language ?? "text"} code={part.content} />;
            }
            return (
              <p
                key={i}
                className="text-[15px] leading-6 text-ink whitespace-pre-wrap break-words"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                {renderInlineCode(part.content)}
                {isStreaming && i === parts.length - 1 && (
                  <StreamingCaret />
                )}
              </p>
            );
          })}
          {parts.length === 0 && isStreaming && (
            <span className="inline-block">
              <StreamingCaret />
            </span>
          )}
        </div>
    </div>
  );
}

function renderInlineCode(text: string) {
  const parts: React.ReactNode[] = [];
  const regex = /`([^`]+)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <code
        key={match.index}
        className="rounded-[4px] px-[6px] py-[2px] text-[13.5px]"
        style={{
          fontFamily: "var(--font-geist-mono)",
          backgroundColor: "var(--color-code-bg)",
          color: "var(--color-ink)",
        }}
      >
        {match[1]}
      </code>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function StreamingCaret() {
  return (
    <span
      className="inline-block w-[2px] h-[18px] ml-0.5 align-text-bottom"
      style={{
        backgroundColor: "var(--color-accent)",
        animation: "gemmacode-blink 900ms linear infinite",
      }}
      aria-hidden="true"
    />
  );
}
