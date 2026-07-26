"use client";

import { useState } from "react";
import { ChatProvider } from "@/lib/chat-store";
import { ThemeProvider } from "@/lib/theme";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Thread } from "@/components/Thread";
import { MobileDrawer } from "@/components/MobileDrawer";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ThemeProvider>
      <ChatProvider>
        <div className="h-dvh flex">
          <div className="hidden lg:flex">
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
            />
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <Header
              onMenuClick={() => setDrawerOpen(true)}
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
            />
            <Thread />
          </div>

          <MobileDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />
        </div>
      </ChatProvider>
    </ThemeProvider>
  );
}
