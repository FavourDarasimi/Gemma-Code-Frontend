"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { useChat } from "@/lib/chat-store";
import { getAccessToken, getSession, signOut } from "@/lib/auth";
import { Delete02Icon, PanelLeftCloseIcon, PanelLeftOpenIcon, CodeIcon, Logout01Icon } from "@/lib/icons";
import { LogoutModal } from "./LogoutModal";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const { state, selectConversation, deleteConv, newChat } = useChat();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [showLogout, setShowLogout] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSession().then((session) => {
      if (session) setEmail(session.email);
    });
  }, []);

  const initials = email
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

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

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    setShowLogout(false);
    router.push("/sign-in");
  };

  const isLoggedIn = !!getAccessToken();
  const visibleConvs = state.conversations;

  if (collapsed) {
    return (
      <aside className="w-12 shrink-0 border-r border-line bg-surface flex flex-col items-center py-3 gap-4 h-full">
        <div className="flex items-center justify-center w-8 h-8 rounded-[6px] bg-accent text-white">
          <HugeiconsIcon icon={CodeIcon} size={18} />
        </div>
        <button
          onClick={onToggleCollapse}
          aria-label="Expand sidebar"
          className="flex items-center justify-center w-8 h-8 text-muted hover:text-ink hover:bg-paper rounded-[6px] transition-colors duration-100 mt-auto"
        >
          <HugeiconsIcon icon={PanelLeftOpenIcon} size={18} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-60 shrink-0 border-r border-line bg-surface flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center w-7 h-7 rounded-[6px] bg-accent text-white shrink-0">
            <HugeiconsIcon icon={CodeIcon} size={16} />
          </div>
          <span
            className="text-sm font-[600] leading-5 text-ink truncate"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            GemmaCode
          </span>
        </div>
        <button
          onClick={onToggleCollapse}
          aria-label="Collapse sidebar"
          className="flex items-center justify-center w-7 h-7 text-muted hover:text-ink hover:bg-paper rounded-[6px] transition-colors duration-100 shrink-0"
        >
          <HugeiconsIcon icon={PanelLeftCloseIcon} size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {visibleConvs.map((conv) => (
          <div
            key={conv.id}
            className={`group flex items-center justify-between px-3 py-2 rounded-[6px] cursor-pointer transition-colors duration-100 text-sm ${
              conv.id === state.currentId
                ? "bg-paper text-ink"
                : "text-muted hover:bg-paper hover:text-ink"
            }`}
            onClick={() => selectConversation(conv.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectConversation(conv.id);
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

      <div className="relative p-3 border-t border-line" ref={menuRef}>
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
              onClick={() => setShowLogout(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-ink hover:bg-paper transition-colors duration-100"
            >
              <HugeiconsIcon icon={Logout01Icon} size={16} className="text-muted" />
              Sign out
            </button>
          </div>
        )}
      </div>

      <LogoutModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleSignOut}
      />
    </aside>
  );
}
