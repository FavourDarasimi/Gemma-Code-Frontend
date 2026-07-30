"use client";

export interface Session {
  email: string;
}

const ACCESS_KEY = "gemmacode-access";
const REFRESH_KEY = "gemmacode-refresh";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

function setTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
  window.dispatchEvent(new Event("gemmacode-auth-change"));
}

function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  window.dispatchEvent(new Event("gemmacode-auth-change"));
}

export async function getSession(): Promise<Session | null> {
  const token = getAccessToken();
  if (!token) return null;

  const res = await fetch("/api/auth/session/", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    const data = await res.json();
    return { email: data.email };
  }

  if (res.status !== 401) return null;

  const refreshed = await tryRefresh();
  if (!refreshed) {
    clearTokens();
    return null;
  }

  const retryRes = await fetch("/api/auth/session/", {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  if (!retryRes.ok) {
    clearTokens();
    return null;
  }

  const data = await retryRes.json();
  return { email: data.email };
}

async function tryRefresh(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  const res = await fetch("/api/auth/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) return false;

  const data = await res.json();
  localStorage.setItem(ACCESS_KEY, data.access);
  if (data.refresh) {
    localStorage.setItem(REFRESH_KEY, data.refresh);
  }
  return true;
}

export async function signInWithOAuth(provider: "github" | "google"): Promise<void> {
  const res = await fetch(`/api/auth/oauth/${provider}/redirect/`);
  if (!res.ok) throw new Error("Failed to get OAuth URL");
  const data = await res.json();
  window.location.href = data.authorization_url;
}

export async function signInWithPassword(email: string, password: string): Promise<Session> {
  const res = await fetch("/api/auth/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err.email || err.detail || "Sign in failed";
    throw new Error(msg);
  }

  const data = await res.json();
  setTokens(data.access, data.refresh);
  return { email: data.user.email };
}

export async function signUpWithPassword(email: string, password: string): Promise<Session> {
  const res = await fetch("/api/auth/signup/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const field = err.email || err.password;
    const msg = Array.isArray(field) ? field[0] : field || "Sign up failed";
    throw new Error(msg);
  }

  const data = await res.json();
  setTokens(data.access, data.refresh);
  return { email: data.user.email };
}

export async function signOut(): Promise<void> {
  const refresh = getRefreshToken();
  if (refresh) {
    try {
      await fetch("/api/auth/logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
    } catch {}
  }
  clearTokens();
}
