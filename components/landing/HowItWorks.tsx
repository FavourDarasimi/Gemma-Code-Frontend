"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Pen01Icon,
  AiBrain01Icon,
  CodeIcon,
  InputTextIcon,
  Tick01Icon,
} from "@/lib/icons";
import { motion, useReducedMotion } from "framer-motion";

const stages = [
  {
    label: "Input",
    options: [
      { icon: Pen01Icon, title: "Describe your idea", detail: "\"I need JWT authentication…\"" },
      { icon: InputTextIcon, title: "Paste Error", detail: "Stack trace or error message" },
    ],
  },
  {
    label: "AI Process",
    options: [
      { icon: AiBrain01Icon, title: "AI understands", detail: "Analyzes requirements, context, and code." },
      { icon: AiBrain01Icon, title: "AI Finds Issue", detail: "Pinpoints root cause" },
    ],
  },
  {
    label: "Output",
    options: [
      { icon: CodeIcon, title: "Get working code", detail: "Copy, edit, and ship." },
      { icon: Tick01Icon, title: "Get Fix", detail: "Working solution with explanation" },
    ],
  },
];

function StageCard({
  icon,
  title,
  detail,
  index,
  prefersReducedMotion,
}: {
  icon: typeof Pen01Icon;
  title: string;
  detail: string;
  index: number;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: prefersReducedMotion ? 0.001 : 0.25,
        ease: "easeOut",
        delay: prefersReducedMotion ? 0 : index * 0.08,
      }}
      className="rounded-[6px] border border-line bg-surface p-5 transition-all duration-200 hover:border-accent relative z-10 h-[104px] flex flex-col"
    >
      <div className="flex items-center gap-3 mb-2 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white shrink-0">
          <HugeiconsIcon icon={icon} size={16} />
        </div>
        <h3
          className="text-sm font-[600] leading-5 text-ink"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          {title}
        </h3>
      </div>
      <p
        className="text-sm leading-5 text-muted pl-11 flex-1 flex items-start"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        {detail}
      </p>
    </motion.div>
  );
}

function StageColumn({
  stage,
  si,
  prefersReducedMotion,
}: {
  stage: (typeof stages)[number];
  si: number;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <div className="flex flex-col items-center min-w-[260px] max-w-[300px]">
      <span
        className="text-xs font-[500] text-accent leading-4 tracking-[0.04em] uppercase mb-5 shrink-0"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        {stage.label}
      </span>
      <div className="w-full flex flex-col gap-3">
        {stage.options.map((opt, oi) => (
          <StageCard
            key={opt.title}
            {...opt}
            index={si * 2 + oi}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </div>
  );
}


export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="text-center mb-16">
          <p
            className="text-xs font-[500] text-muted leading-4 tracking-[0.04em] uppercase mb-4"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            How It Works
          </p>
          <h2
            className="text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] font-[600] text-ink"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Three simple steps
          </h2>
        </div>

        {/* Desktop: horizontal workflow */}
        <div className="hidden md:flex md:flex-row md:items-stretch md:justify-center gap-5">
          {stages.flatMap((stage, si) => {
            const elements = [
              <StageColumn key={stage.label} stage={stage} si={si} prefersReducedMotion={prefersReducedMotion} />,
            ];
            if (si < stages.length - 1) {
            }
            return elements;
          })}
        </div>

        {/* Mobile: vertical workflow */}
        <div className="flex md:hidden flex-col items-center gap-5">
          {stages.map((stage, si) => (
            <div key={stage.label} className="flex flex-col items-center w-full">
              <span
                className="text-xs font-[500] text-accent leading-4 tracking-[0.04em] uppercase mb-5"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                {stage.label}
              </span>
              <div className="w-full max-w-[320px] flex flex-col gap-3">
                {stage.options.map((opt, oi) => (
                  <StageCard
                    key={opt.title}
                    {...opt}
                    index={si * 2 + oi}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
