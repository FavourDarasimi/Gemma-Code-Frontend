"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { useChat } from "@/lib/chat-store";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Thread } from "@/components/Thread";
import { Composer } from "@/components/Composer";
import { MobileDrawer } from "@/components/MobileDrawer";

export default function ChatPage() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { send, state } = useChat();

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/sign-in");
    }
  }, [router]);

  return (
    <div className="h-dvh flex overflow-hidden">
      <div className="hidden lg:flex shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        <Header
          onMenuClick={() => setDrawerOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
        />
        <Thread />
        <Composer onSend={send} disabled={state.isStreaming || state.isContinuing} />
      </div>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
