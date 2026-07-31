"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@/lib/icons";

const faqs = [
  {
    q: "Can it read repositories?",
    a: "Yes. Point it at any public or private repository and GemmaCode will index the codebase, understand the structure, and answer questions grounded in your actual code.",
  },
  {
    q: "Does it support React?",
    a: "React, Next.js, and most modern frameworks are first-class citizens. GemmaCode generates idiomatic components, hooks, and knows the ecosystem conventions.",
  },
  {
    q: "Can it debug stack traces?",
    a: "Paste a full stack trace or error message and GemmaCode pinpoints the root cause, explains what went wrong, and offers a working fix with context.",
  },
  {
    q: "Which languages?",
    a: "TypeScript, JavaScript, Python, Rust, Go, Java, C++, Ruby, SQL, shell, and more. Syntax highlighting and framework-specific patterns are built in.",
  },
  {
    q: "Does it remember context?",
    a: "Every conversation is preserved. GemmaCode keeps track of your codebase, recent files, and prior discussions so you never have to repeat yourself.",
  },
];

function FaqCard({
  question,
  answer,
  open,
  onToggle,
  index,
  prefersReducedMotion,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  index: number;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: prefersReducedMotion ? 0.001 : 0.2,
        ease: "easeOut",
        delay: prefersReducedMotion ? 0 : index * 0.06,
      }}
      className={`rounded-[8px] border transition-colors duration-200 ${
        open
          ? "border-accent bg-accent/[0.03] dark:bg-accent/[0.05]"
          : "border-line bg-surface hover:border-muted/30"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span
          className="text-sm font-[500] leading-5 text-ink flex-1 min-w-0"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          {question}
        </span>
        <span className={`shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
          <HugeiconsIcon icon={Add01Icon} size={18} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={prefersReducedMotion ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.001 : 0.2, ease: "easeOut" }}
          >
            <p
              className="text-sm leading-6 text-muted px-5 pb-5 -mt-1"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[700px] mx-auto px-6">
        <div className="text-center mb-14">
          <p
            className="text-xs font-[500] text-muted leading-4 tracking-[0.04em] uppercase mb-4"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            FAQ
          </p>
          <h2
            className="text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] font-[600] text-ink mb-3"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Got questions?
          </h2>
          <p
            className="text-sm leading-5 text-muted"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            We&apos;ve got answers.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FaqCard
              key={faq.q}
              question={faq.q}
              answer={faq.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              index={i}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
