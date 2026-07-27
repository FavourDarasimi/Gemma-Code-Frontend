"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@/lib/icons";
import { motion, useReducedMotion } from "framer-motion";

export function CtaBand() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-32 md:py-40 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0.001 : 0.35, ease: "easeOut" }}
          className="relative rounded-[12px] border border-line overflow-hidden"
          style={{
            backgroundImage: "radial-gradient(1.5px 1.5px at 50% 50%, var(--dot-color) 1.5px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-paper/0 via-paper/40 to-paper/0 dark:from-paper/0 dark:via-paper/30 dark:to-paper/0 pointer-events-none" />

          <div className="relative md:grid md:grid-cols-2 md:items-center gap-12 py-20 md:py-28 px-8 md:px-16">
            <div>
              <p
                className="text-xs font-[500] text-accent leading-4 tracking-[0.04em] uppercase mb-5"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                Start free today
              </p>
              <h2
                className="text-[32px] leading-[40px] md:text-[52px] md:leading-[60px] font-[600] text-ink mb-4"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                Ready to build
                <br />
                faster?
              </h2>
              <p
                className="text-base leading-6 text-muted max-w-sm mb-8"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                No credit card required. Full access on the free plan.
              </p>
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 rounded-[6px] bg-accent text-white px-7 py-3.5 text-[15px] font-[500] leading-5 transition-all duration-150 hover:bg-accent-ink active:scale-[0.97]"
              >
                Start Building
                <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                </span>
              </Link>
            </div>

            {/* Gem shape — pure CSS Tier A enrichment */}
            <div className="hidden md:flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: prefersReducedMotion ? 0.001 : 0.5, ease: "easeOut" }}
                className="relative w-56 h-56"
              >
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-[24px] border border-line rotate-45" />

                {/* Inner gem */}
                <div className="absolute inset-4 rounded-[16px] border border-accent/40 rotate-45 flex items-center justify-center">
                  <div
                    className="w-full h-full rounded-[16px]"
                    style={{
                      backgroundImage: "radial-gradient(1.5px 1.5px at 50% 50%, var(--color-accent) 1.5px, transparent 0)",
                      backgroundSize: "16px 16px",
                      opacity: 0.15,
                    }}
                  />
                </div>

                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={prefersReducedMotion ? {} : { scale: [1, 1.15, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-3 h-3 rounded-full bg-accent"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
