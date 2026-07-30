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

function renderText(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let inList: "ul" | "ol" | null = null;
  let listItems: React.ReactNode[] = [];

  function flushList() {
    if (listItems.length > 0) {
      const Tag = inList === "ol" ? "ol" : "ul";
      elements.push(
        <Tag key={`list-${elements.length}`} className="space-y-1 my-3">
          {listItems}
        </Tag>
      );
      listItems = [];
      inList = null;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      flushList();
      continue;
    }

    // Heading
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const content = renderInline(headingMatch[2]);
      const Tag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
      const size = level === 1 ? "text-[20px] leading-[28px] font-[600]" : level === 2 ? "text-[17px] leading-[24px] font-[600]" : "text-[15px] leading-[22px] font-[600]";
      elements.push(
        <Tag key={`h-${i}`} className={`${size} text-ink mt-6 mb-2 first:mt-0`} style={{ fontFamily: "var(--font-geist-sans)" }}>
          {content}
        </Tag>
      );
      continue;
    }

    // Unordered list
    const ulMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      if (inList !== "ul") {
        flushList();
        inList = "ul";
      }
      listItems.push(
        <li key={`li-${i}`} className="text-[15px] leading-6 text-ink ml-5 list-disc" style={{ fontFamily: "var(--font-geist-sans)" }}>
          {renderInline(ulMatch[1])}
        </li>
      );
      continue;
    }

    // Ordered list
    const olMatch = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (olMatch) {
      if (inList !== "ol") {
        flushList();
        inList = "ol";
      }
      listItems.push(
        <li key={`li-${i}`} className="text-[15px] leading-6 text-ink ml-5 list-decimal" style={{ fontFamily: "var(--font-geist-sans)" }}>
          {renderInline(olMatch[1])}
        </li>
      );
      continue;
    }

    flushList();

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-[15px] leading-6 text-ink my-2" style={{ fontFamily: "var(--font-geist-sans)" }}>
        {renderInline(line)}
      </p>
    );
  }

  flushList();
  return elements;
}

function renderInline(text: string) {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]?.startsWith("**")) {
      parts.push(
        <strong key={`b-${match.index}`} className="font-[600] text-ink">
          {match[2]}
        </strong>
      );
    } else if (match[3] !== undefined) {
      parts.push(
        <code
          key={`c-${match.index}`}
          className="rounded-[4px] px-[6px] py-[2px] text-[13.5px]"
          style={{
            fontFamily: "var(--font-geist-mono)",
            backgroundColor: "var(--color-code-bg)",
            color: "var(--color-ink)",
          }}
        >
          {match[3]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export function MessageAssistant({ message, isStreaming }: MessageAssistantProps) {
  const parts = useMemo(() => parseContent(message.content), [message.content]);

  return (
    <div className="flex-1 min-w-0">

      <div>
        {parts.map((part, i) => {
          if (part.type === "code") {
            return <CodeBlock key={i} language={part.language ?? "text"} code={part.content} />;
          }
          return (
            <div key={i} className="min-w-0">
              {renderText(part.content)}
              {isStreaming && i === parts.length - 1 && (
                <StreamingCaret />
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
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
