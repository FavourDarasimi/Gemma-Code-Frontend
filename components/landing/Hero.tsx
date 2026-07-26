"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Composer } from "@/components/Composer";
import { MessageAssistant } from "@/components/MessageAssistant";
import type { Message } from "@/lib/types";
import { motion, useReducedMotion } from "framer-motion";

const seededMessage: Message = {
  id: "seed-1",
  role: "assistant",
  content:
    "Here's how you can implement that:\n\n```ts\nfunction fibonacci(n: number): number {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n```\n\nThis recursive approach works for small values but gets expensive quickly. For larger inputs, consider memoization or iteration.",
  timestamp: Date.now(),
};

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="max-w-[1120px] mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.001 : 0.2, ease: "easeOut" }}
        >
          <h1
            className="text-[32px] leading-[40px] md:text-[44px] md:leading-[52px] font-[600] text-ink mb-4"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            A code assistant that reads the whole file, not just the line
          </h1>
          <p
            className="text-lg leading-7 text-muted mb-8 max-w-md"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Ask about a bug, paste a stack trace, or describe what you&apos;re building — get clear answers with real code.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/sign-up">
              <Button variant="primary" className="px-6">
                Start free
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="ghost">Sign in</Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0.001 : 0.2,
            ease: "easeOut",
            delay: prefersReducedMotion ? 0 : 0.1,
          }}
          className="min-w-0"
        >
          <div className="rounded-[6px] border border-line bg-surface overflow-hidden">
            <div className="px-4 py-3 border-b border-line">
              <p
                className="text-xs font-[500] text-muted leading-4 tracking-[0.04em] uppercase"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                gemmacode
              </p>
            </div>
            <div className="p-4 space-y-4">
              <MessageAssistant message={seededMessage} />
            </div>
            <div className="border-t border-line">
              <Composer onSend={() => {}} disabled />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
