"use client";

import type { Message } from "@/lib/types";

interface MessageUserProps {
  message: Message;
}

export function MessageUser({ message }: MessageUserProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%]">
        <div className="rounded-[6px] border border-line bg-surface w-fit px-1.5 py-1.5">
          <p className="text-[15px] leading-6 text-ink whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        <p
          className="text-[12px] leading-4 text-muted mt-1 text-right"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
