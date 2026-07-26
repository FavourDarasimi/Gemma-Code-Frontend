"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "@/lib/theme";
import { ChatProvider } from "@/lib/chat-store";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ChatProvider>{children}</ChatProvider>
    </ThemeProvider>
  );
}
