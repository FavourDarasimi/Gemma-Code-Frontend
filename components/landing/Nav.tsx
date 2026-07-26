"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { CodeIcon, Menu01Icon } from "@/lib/icons";
import { Button } from "@/components/ui/Button";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const bgColor = scrolled
    ? "rgba(255,255,255,1)"
    : "rgba(246,247,248,0)";
  const borderColor = scrolled
    ? "rgba(228,230,234,1)"
    : "rgba(228,230,234,0)";

  return (
    <>
      <motion.nav
        animate={{
          backgroundColor: bgColor,
          borderBottomColor: borderColor,
        }}
        transition={{ duration: prefersReducedMotion ? 0.001 : 0.15, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-30 h-16 flex items-center border-b"
        style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}
      >
        <div className="flex items-center justify-between w-full max-w-[1120px] mx-auto px-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center justify-center w-7 h-7 rounded-[6px] bg-accent text-white">
              <HugeiconsIcon icon={CodeIcon} size={16} />
            </div>
            <span
              className="text-lg font-[600] leading-6 text-ink"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              GemmaCode
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="primary">Sign up</Button>
            </Link>
          </div>

          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="flex md:hidden items-center justify-center p-2 text-ink hover:bg-paper rounded-[6px] transition-colors duration-100"
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-40 bg-ink/20"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-0 left-0 bottom-0 z-50 w-60 bg-surface border-r border-line shadow-[0_4px_16px_rgba(20,22,26,0.08)] flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-line shrink-0">
              <div className="flex items-center justify-center w-7 h-7 rounded-[6px] bg-accent text-white shrink-0">
                <HugeiconsIcon icon={CodeIcon} size={16} />
              </div>
              <span
                className="text-sm font-[600] leading-5 text-ink"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                GemmaCode
              </span>
            </div>
            <div className="flex-1 p-3 space-y-2">
              <Link
                href="/sign-in"
                onClick={() => setDrawerOpen(false)}
                className="block px-3 py-2 rounded-[6px] text-sm text-muted hover:bg-paper hover:text-ink transition-colors duration-100"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setDrawerOpen(false)}
                className="block px-3 py-2 rounded-[6px] text-sm text-muted hover:bg-paper hover:text-ink transition-colors duration-100"
              >
                Sign up
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
