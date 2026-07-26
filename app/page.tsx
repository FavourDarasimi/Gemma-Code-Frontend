"use client";

import { ThemeProvider } from "@/lib/theme";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { WhatCanItDo } from "@/components/landing/WhatCanItDo";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { EverythingItHelpsWith } from "@/components/landing/EverythingItHelpsWith";
import { Faq } from "@/components/landing/Faq";
import { ProofSection } from "@/components/landing/ProofSection";
import { CtaBand } from "@/components/landing/CtaBand";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <ThemeProvider>
      <div
        style={{
          backgroundImage: "radial-gradient(1.5px 1.5px at 50% 50%, var(--dot-color) 1.5px, transparent 0)",
          backgroundSize: "24px 24px",
          minHeight: "100dvh",
        }}
      >
        <Nav />
        <main>
        <Hero />
        <WhatCanItDo />
        <HowItWorks />
        <EverythingItHelpsWith />
        <Faq />
        <ProofSection />
          <CtaBand />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
