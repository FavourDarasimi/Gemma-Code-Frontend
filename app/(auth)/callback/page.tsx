"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ThemeProvider } from "@/lib/theme";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const access = searchParams.get("access");
    const refresh = searchParams.get("refresh");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError(decodeURIComponent(errorParam.replace(/\+/g, " ")));
      return;
    }

    if (access && refresh) {
      localStorage.setItem("gemmacode-access", access);
      localStorage.setItem("gemmacode-refresh", refresh);
      router.replace("/chat");
    } else {
      setError("Missing authentication tokens");
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-ink text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <p className="text-muted text-sm">Completing sign in\u2026</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <ThemeProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-surface">
            <p className="text-muted text-sm">Loading\u2026</p>
          </div>
        }
      >
        <CallbackInner />
      </Suspense>
    </ThemeProvider>
  );
}
