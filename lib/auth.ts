"use client";

export interface Session {
  email: string;
}

const SESSION_KEY = "gemmacode-session";

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function signInWithOAuth(provider: "github" | "google"): Promise<Session> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const session: Session = { email: `user@${provider}.com` };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      resolve(session);
    }, 400);
  });
}

export function signInWithPassword(email: string, _password: string): Promise<Session> {
  void _password;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const user = users.find((u) => u.email === email);
      if (!user) {
        reject(new Error("That email or password isn't right."));
        return;
      }
      const session: Session = { email };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      resolve(session);
    }, 400);
  });
}

export function signUpWithPassword(email: string, _password: string): Promise<Session> {
  void _password;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      if (users.some((u) => u.email === email)) {
        reject(new Error("An account with this email already exists."));
        return;
      }
      users.push({ email });
      localStorage.setItem("gemmacode-users", JSON.stringify(users));
      const session: Session = { email };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      resolve(session);
    }, 400);
  });
}

export function signOut(): void {
  localStorage.removeItem(SESSION_KEY);
}

interface StoredUser {
  email: string;
}

function getUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem("gemmacode-users");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
