"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { CodeIcon, ArrowRight01Icon, Add01Icon, Copy01Icon } from "@/lib/icons";
import { motion, useReducedMotion } from "framer-motion";

const capabilities = [
  {
    icon: CodeIcon,
    title: "Reads full context",
    description: "Understands your entire file, not just the selection — so answers make sense in context.",
  },
  {
    icon: ArrowRight01Icon,
    title: "Streams as it thinks",
    description: "No waiting. Start reading the response while the rest is still being generated.",
  },
  {
    icon: Add01Icon,
    title: "Handles any language",
    description: "TypeScript, Python, Go, Rust, SQL — whatever your stack, it speaks the same language.",
  },
  {
    icon: Copy01Icon,
    title: "Code you can copy",
    description: "Clean code blocks with syntax highlighting and a single-click copy button.",
  },
];

export function CapabilityGrid() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1120px] mx-auto px-6">
        <p
          className="text-xs font-[500] text-muted leading-4 tracking-[0.04em] uppercase mb-4"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Capabilities
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: prefersReducedMotion ? 0.001 : 0.2,
                ease: "easeOut",
                delay: prefersReducedMotion ? 0 : i * 0.05,
              }}
              className="rounded-[6px] border border-line bg-surface p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <HugeiconsIcon icon={cap.icon} size={20} className="text-accent shrink-0" />
                <h3
                  className="text-sm font-[600] leading-5 text-ink"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                  {cap.title}
                </h3>
              </div>
              <p
                className="text-sm leading-5 text-muted"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                {cap.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
