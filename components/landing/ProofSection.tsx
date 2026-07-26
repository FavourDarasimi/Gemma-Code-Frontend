"use client";

import { CodeBlockHighlighted } from "@/components/CodeBlock";
import { motion, useReducedMotion } from "framer-motion";

const exampleCode = `// Before: nested conditions hide the actual logic
function getDiscount(user: User, cart: Cart): number {
  if (user.tier === "premium") {
    if (cart.total > 100) {
      return 0.2;
    }
    return 0.1;
  }
  if (user.tier === "member" && cart.total > 200) {
    return 0.15;
  }
  return 0;
}

// After: each case returns early, flat and clear
function getDiscount(user: User, cart: Cart): number {
  if (user.tier === "premium" && cart.total > 100) return 0.2;
  if (user.tier === "premium") return 0.1;
  if (user.tier === "member" && cart.total > 200) return 0.15;
  return 0;
}`;

export function ProofSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1120px] mx-auto px-6">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0.001 : 0.2, ease: "easeOut" }}
        >
          <p
            className="text-xs font-[500] text-muted leading-4 tracking-[0.04em] uppercase mb-4"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Real example
          </p>
          <h2
            className="text-2xl font-[600] leading-8 text-ink mb-4"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Clearer code, one suggestion at a time
          </h2>
          <p
            className="text-[15px] leading-6 text-muted mb-8 max-w-lg"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Ask GemmaCode to refactor nested conditionals, and it shows you the before and after — with syntax-highlighted code you can copy in one click.
          </p>
          <div className="max-w-2xl">
            <CodeBlockHighlighted language="typescript" code={exampleCode} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
