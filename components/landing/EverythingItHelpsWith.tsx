"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Tick01Icon } from "@/lib/icons";

const items = [
  "Bug fixing",
  "Code generation",
  "Error explanations",
  "SQL queries",
  "Regex",
  "API development",
  "Frontend",
  "Backend",
  "DevOps",
  "Docker",
  "Kubernetes",
  "React",
  "Next.js",
  "Django",
  "Python",
  "Node",
  "TypeScript",
  "Rust",
];

export function EverythingItHelpsWith() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1500px] mx-auto">
        <div className="text-center mb-14 px-6">
          <p
            className="text-xs font-[500] text-muted leading-4 tracking-[0.04em] uppercase mb-4"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Everything It Helps With
          </p>
          <h2
            className="text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] font-[600] text-ink"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            One AI assistant for every coding task.
          </h2>
        </div>

        <div className="overflow-hidden">
          <div className="flex items-center gap-3 marquee-track">
            {[...items, ...items].map((item, i) => (
              <div
                key={`${item}-${i}`}
                className="flex items-center gap-2 rounded-[6px] border border-line bg-surface px-4 py-3 transition-all duration-200 hover:border-accent shrink-0"
              >
                <HugeiconsIcon icon={Tick01Icon} size={16} className="text-accent shrink-0" />
                <span
                  className="text-sm leading-5 text-ink whitespace-nowrap"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
