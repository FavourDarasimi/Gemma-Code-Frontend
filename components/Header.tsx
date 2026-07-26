"use client";

import { Add01Icon, Menu01Icon, Moon02Icon, Sun01Icon, PanelLeftCloseIcon } from "@/lib/icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useChat } from "@/lib/chat-store";
import { useTheme } from "@/lib/theme";

interface HeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Header({ onMenuClick, sidebarCollapsed, onToggleSidebar }: HeaderProps) {
  const { newChat } = useChat();
  const { theme, toggle } = useTheme();

  return (
    <header className="flex items-center justify-between h-14 px-4 md:px-6 border-b border-line bg-surface shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex items-center justify-center p-2 -ml-2 text-ink hover:bg-paper rounded-[6px] transition-colors duration-100 lg:hidden"
        >
          <HugeiconsIcon icon={Menu01Icon} size={20} />
        </button>
        <button
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:flex items-center justify-center p-2 -ml-2 text-muted hover:text-ink hover:bg-paper rounded-[6px] transition-colors duration-100"
        >
          <HugeiconsIcon icon={PanelLeftCloseIcon} size={20} />
        </button>
        <span
          className="text-xs font-[500] text-muted leading-4 tracking-[0.04em] uppercase"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          code-assistant-v1
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="flex items-center justify-center p-2 text-muted hover:text-ink hover:bg-paper rounded-[6px] transition-colors duration-100"
        >
          <HugeiconsIcon icon={theme === "dark" ? Sun01Icon : Moon02Icon} size={20} />
        </button>
        <button
          onClick={newChat}
          aria-label="New chat"
          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-[6px] text-sm font-[500] leading-5 bg-transparent border border-line text-ink hover:bg-paper transition-colors duration-100"
        >
          <HugeiconsIcon icon={Add01Icon} size={20} />
          <span className="hidden sm:inline">New chat</span>
        </button>
      </div>
    </header>
  );
}
