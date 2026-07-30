"use client";

import { useEffect, useRef } from "react";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ open, onClose, onConfirm }: LogoutModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="bg-surface border border-line rounded-xl p-6 w-80 shadow-xl">
        <h2 className="text-sm font-[600] text-ink mb-2">Sign out</h2>
        <p className="text-sm text-muted mb-6">Are you sure you want to sign out?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-ink bg-paper rounded-[6px] hover:bg-line transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white bg-danger rounded-[6px] hover:opacity-90 transition-opacity"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
