"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { CodeIcon, Menu01Icon } from "@/lib/icons";
import { Button } from "@/components/ui/Button";

const sections = [
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How It Works" },
  { id: "faq", label: "FAQ" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.nav
        animate={{
          backgroundColor: "var(--glass-bg)",

        }}
        transition={{ duration: prefersReducedMotion ? 0.001 : 0.15, ease: "easeOut" }}
        className={`fixed border border-line max-w-[900px] mx-auto mt-3 px-3 rounded-full top-0 left-3 right-3 md:left-0 md:right-0 z-30 h-16 flex items-center transition-[background-color] duration-150 ${
          scrolled ? "backdrop-blur-xl" : ""
        }`}

      >
        <div className="flex items-center justify-between w-full mx-auto px-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center justify-center w-7 h-7 rounded-[6px] bg-accent text-on-accent">
              <HugeiconsIcon icon={CodeIcon} size={16} />
            </div>
            <span
              className="text-lg font-[600] leading-6 text-ink"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              GemmaCode
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="text-sm leading-5 text-muted hover:text-ink transition-colors duration-100"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                {s.label}
              </button>
            ))}
            <div className="flex items-center gap-3 ml-2">
              <Link href="/sign-in">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="primary">Sign up</Button>
              </Link>
            </div>
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
              className="fixed inset-0 z-50 bg-surface flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-line shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-7 h-7 rounded-[6px] bg-accent text-on-accent shrink-0">
                    <HugeiconsIcon icon={CodeIcon} size={16} />
                  </div>
                  <span
                    className="text-sm font-[600] leading-5 text-ink"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    GemmaCode
                  </span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="flex items-center justify-center p-2 text-ink hover:bg-paper rounded-[6px] transition-colors duration-100"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M 5,5 L 15,15 M 15,5 L 5,15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 p-4 space-y-1">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { scrollTo(s.id); setDrawerOpen(false); }}
                    className="block w-full text-left px-3 py-2.5 rounded-[6px] text-sm text-muted hover:bg-paper hover:text-ink transition-colors duration-100"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    {s.label}
                  </button>
                ))}
                <div className="border-t border-line my-4" />
                <Link
                  href="/sign-in"
                  onClick={() => setDrawerOpen(false)}
                  className="block px-3 py-2.5 rounded-[6px] text-sm text-muted hover:bg-paper hover:text-ink transition-colors duration-100"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setDrawerOpen(false)}
                  className="block px-3 py-2.5 rounded-[6px] text-sm text-muted hover:bg-paper hover:text-ink transition-colors duration-100"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
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
