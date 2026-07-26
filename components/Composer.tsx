"use client";

import { useState, useRef, useCallback, useEffect, type KeyboardEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@/lib/icons";
import { motion } from "framer-motion";

interface ComposerProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function Composer({ onSend, disabled }: ComposerProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = 24;
    const maxHeight = lineHeight * 6;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }, [value, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const canSend = value.trim().length > 0 && !disabled;

  const borderStyle = focused
    ? { borderColor: "var(--color-accent)", boxShadow: "0 0 0 3px rgba(49, 93, 255, 0.12)" }
    : { borderColor: "var(--color-line)", boxShadow: "0 0 0 0 transparent" };

  return (
    <div className="relative pb-[env(safe-area-inset-bottom)]">
      <div
        className="absolute inset-x-0 bottom-full h-8 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--color-paper))",
        }}
      />
      <div className="max-w-[720px] mx-auto px-4 md:px-6 py-3">
        <div
          className="relative flex items-end rounded-[6px] border bg-surface transition-colors duration-100"
          style={borderStyle}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Message the assistant…"
            rows={1}
            disabled={disabled}
            aria-label="Message the assistant"
            className="flex-1 resize-none bg-transparent px-4 py-3 pr-14 text-[15px] leading-6 text-ink placeholder:text-muted outline-none disabled:opacity-50"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          />
          <div className="absolute bottom-2 right-2">
            <motion.button
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Send message"
              whileTap={canSend ? { scale: 0.96 } : undefined}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="flex items-center justify-center w-9 h-9 rounded-[6px] transition-colors duration-100"
              style={{
                backgroundColor: canSend ? "var(--color-accent)" : "var(--color-line)",
                color: canSend ? "#fff" : "var(--color-muted)",
                pointerEvents: canSend ? "auto" : "none",
              }}
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
