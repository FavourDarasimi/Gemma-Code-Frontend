"use client";

import { useState } from "react";
import type { Message } from "@/lib/types";

interface MessageUserProps {
  message: Message;
}

export function MessageUser({ message }: MessageUserProps) {
  const [showTime, setShowTime] = useState(false);

  return (
    <div
      className="flex justify-end"
      onMouseEnter={() => setShowTime(true)}
      onMouseLeave={() => setShowTime(false)}
    >
      <div className="max-w-[85%]">
        {showTime && (
          <p
            className="text-[12px] leading-4 text-muted mb-1 text-right"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
        <p className="text-[15px] leading-6 text-ink whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
}
