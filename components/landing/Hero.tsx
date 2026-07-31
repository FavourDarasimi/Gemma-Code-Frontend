"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { CodeIcon } from "@/lib/icons";
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
      <div className="max-w-[1500px] mx-auto px-6 text-center">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.001 : 0.2, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-line t-label text-muted mb-6">
            <HugeiconsIcon icon={CodeIcon} size={16} />
            AI code assistant
          </div>

          <h1
            className="text-[36px] leading-[44px] md:text-[52px] md:leading-[60px] font-bold text-ink mb-8 tracking-tight mx-auto max-w-[760px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Describe what you want. Paste your error. Get working code.
          </h1>
          <p
            className="text-lg leading-7 text-muted mb-8 mx-auto max-w-[650px]"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Build full features, fix bugs, explain errors, and generate production-ready code in seconds. Just tell the AI what you&apos;re trying to build or paste your stack trace.          </p>
          <div className="flex items-center justify-center gap-3 mb-16">
            <Link href="/sign-up">
              <Button variant="primary" size="lg">
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
          className="max-w-[700px] mx-auto"
        >
          <div className="rounded-[24px] border border-line bg-surface overflow-hidden">
            <div className="p-4 md:p-5 space-y-4 text-left">
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
