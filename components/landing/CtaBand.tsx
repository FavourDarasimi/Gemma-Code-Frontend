"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@/lib/icons";
import { motion, useReducedMotion } from "framer-motion";

export function CtaBand() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-32 md:py-48">
      <div className="max-w-[1500px] mx-auto px-6">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0.001 : 0.3, ease: "easeOut" }}
          className="relative rounded-[12px] border border-line bg-surface overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(1px 1px at 50% 50%, var(--color-ink-value, #000) 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative py-20 md:py-28 px-8 md:px-20 text-center">
            <p
              className="text-xs font-[500] text-accent leading-4 tracking-[0.04em] uppercase mb-6"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Start free today
            </p>
            <h2
              className="text-[36px] leading-[44px] md:text-[56px] md:leading-[64px] font-[600] text-ink mb-4"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Ready to build faster?
            </h2>
            <p
              className="text-base leading-6 text-muted max-w-md mx-auto mb-10"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              No credit card required. Full access on the free plan.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-[6px] bg-accent text-white px-8 py-4 text-[15px] font-[500] leading-5 transition-all duration-150 hover:bg-accent-ink active:scale-[0.97]"
            >
              Start Building
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
