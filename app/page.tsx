"use client";

import { ThemeProvider } from "@/lib/theme";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { CapabilityGrid } from "@/components/landing/CapabilityGrid";
import { ProofSection } from "@/components/landing/ProofSection";
import { CtaBand } from "@/components/landing/CtaBand";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <ThemeProvider>
      <Nav />
      <main>
        <Hero />
        <CapabilityGrid />
        <ProofSection />
        <CtaBand />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
