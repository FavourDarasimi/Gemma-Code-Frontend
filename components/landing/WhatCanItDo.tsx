"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  CodeIcon,
  Bug01Icon,
  SearchCodeIcon,
  FileSyncIcon,
  TestTube01Icon,
  Doc01Icon,
} from "@/lib/icons";
import { motion, useReducedMotion } from "framer-motion";

const items = [
  {
    icon: CodeIcon,
    title: "Build Features",
    description: "Describe a feature and get production-ready code.",
  },
  {
    icon: Bug01Icon,
    title: "Fix Bugs",
    description: "Paste an error or stack trace and receive a working solution.",
  },
  {
    icon: SearchCodeIcon,
    title: "Explain Code",
    description: "Understand unfamiliar files and complex logic instantly.",
  },
  {
    icon: FileSyncIcon,
    title: "Refactor",
    description: "Improve readability, performance, and maintainability.",
  },
  {
    icon: TestTube01Icon,
    title: "Generate Tests",
    description: "Automatically create unit and integration tests.",
  },
  {
    icon: Doc01Icon,
    title: "Documentation",
    description: "Generate clean documentation and comments.",
  },
];

export function WhatCanItDo() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="text-center mb-16">
          <p
            className="text-xs font-[500] text-muted leading-4 tracking-[0.04em] uppercase mb-4"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            What Can It Do?
          </p>
          <h2
            className="text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] font-[600] text-ink"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            One tool, six workflows
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: prefersReducedMotion ? 0.001 : 0.2,
                ease: "easeOut",
                delay: prefersReducedMotion ? 0 : i * 0.05,
              }}
              className="group rounded-[6px] border border-line bg-surface p-6 hover:border-muted/40 transition-colors duration-150 ease-out"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-[6px]  text-ink mb-4">
                <HugeiconsIcon icon={item.icon} size={20} />
              </div>
              <h3
                className="text-sm font-[600] leading-5 text-ink mb-2"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm leading-5 text-muted"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
