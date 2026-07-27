"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { useChat } from "@/lib/chat-store";
import { getSession, signOut } from "@/lib/auth";
import { Delete02Icon, CodeIcon, Logout01Icon } from "@/lib/icons";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { state, selectConversation, deleteConv, newChat } = useChat();
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const session = getSession();
  const email = session?.email ?? "";
  const initials = email
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = () => {
    signOut();
    setMenuOpen(false);
    onClose();
    router.push("/sign-in");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-ink/20"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            ref={drawerRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-surface flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Chat history"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-line shrink-0">
              <div className="flex items-center gap-2.5">
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
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex items-center justify-center p-2 text-ink hover:bg-paper rounded-[6px] transition-colors duration-100"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M 5,5 L 15,15 M 15,5 L 5,15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {state.conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center justify-between px-3 py-2 rounded-[6px] cursor-pointer transition-colors duration-100 text-sm ${
                    conv.id === state.currentId
                      ? "bg-paper text-ink"
                      : "text-muted hover:bg-paper hover:text-ink"
                  }`}
                  onClick={() => {
                    selectConversation(conv.id);
                    onClose();
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      selectConversation(conv.id);
                      onClose();
                    }
                  }}
                >
                  <span className="truncate flex-1 min-w-0">{conv.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConv(conv.id);
                    }}
                    aria-label="Delete conversation"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-100 p-1 text-muted hover:text-danger rounded-[4px] hover:bg-line/50"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-line shrink-0">
              <div className="p-3 border-b border-line">
                <button
                  onClick={() => {
                    newChat();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-[6px] text-sm font-[500] leading-5 border border-line text-ink hover:bg-paper transition-colors duration-100"
                >
                  New chat
                </button>
              </div>

              <div className="relative p-3" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm text-ink hover:bg-paper transition-colors duration-100"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-line text-xs font-[600] text-ink shrink-0">
                    {initials}
                  </span>
                  <span className="truncate text-muted text-[13px]" style={{ fontFamily: "var(--font-geist-sans)" }}>
                    {email}
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute bottom-full left-3 right-3 mb-1 rounded-[6px] border border-line bg-surface shadow-[0_4px_16px_rgba(20,22,26,0.08)] overflow-hidden">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-ink hover:bg-paper transition-colors duration-100"
                    >
                      <HugeiconsIcon icon={Logout01Icon} size={16} className="text-muted" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
