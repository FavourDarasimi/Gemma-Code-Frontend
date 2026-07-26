"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion, useReducedMotion } from "framer-motion";

export function CtaBand() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1120px] mx-auto px-6 text-center">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0.001 : 0.2, ease: "easeOut" }}
        >
          <h2
            className="text-2xl font-[600] leading-8 text-ink mb-6"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Ready to ship better code?
          </h2>
          <Link href="/sign-up">
            <Button variant="primary" className="px-8">
              Start free
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
