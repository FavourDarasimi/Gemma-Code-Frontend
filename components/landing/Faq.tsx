"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

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

function FaqItem({
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
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: prefersReducedMotion ? 0.001 : 0.15,
        ease: "easeOut",
        delay: prefersReducedMotion ? 0 : index * 0.05,
      }}
      className="border-b border-line last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left transition-colors duration-100 hover:text-accent group"
        aria-expanded={open}
      >
        <span
          className="text-sm font-[500] leading-5 text-ink group-hover:text-accent transition-colors duration-100"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          {question}
        </span>
        <span className={`shrink-0 ml-4 text-muted transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M 8,2 L 8,14 M 2,8 L 14,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
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
              className="text-sm leading-6 text-muted pb-5 -mt-2"
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
            className="text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] font-[600] text-ink"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Frequently asked questions
          </h2>
        </div>

        <div className="border-t border-line">
          {faqs.map((faq, i) => (
            <FaqItem
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
