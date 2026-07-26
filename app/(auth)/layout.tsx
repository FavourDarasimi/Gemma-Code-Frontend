"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "@/lib/theme";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
