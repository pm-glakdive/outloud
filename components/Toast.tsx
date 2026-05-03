"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string | null;
  onDismiss?: () => void;
}

/**
 * Minimal toast / snackbar. Used for safety-net surfaces:
 *   - localStorage write failure → "Streak couldn't be saved"
 *   - Clipboard blocked         → "Copy this manually"
 *
 * Auto-dismisses after 4s. Keyboard-dismissible (esc).
 */
export function Toast({ message, onDismiss }: ToastProps) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (message) {
      setShown(true);
      const id = window.setTimeout(() => {
        setShown(false);
        onDismiss?.();
      }, 4000);
      return () => window.clearTimeout(id);
    }
    setShown(false);
    return;
  }, [message, onDismiss]);

  useEffect(() => {
    if (!shown) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShown(false);
        onDismiss?.();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shown, onDismiss]);

  if (!message || !shown) return null;
  return (
    <div className="fixed inset-x-0 bottom-6 mx-auto max-w-md px-5 z-50">
      <div
        role="status"
        className="bg-ink text-bg rounded-xl px-4 py-3 text-sm shadow-lg flex items-start gap-3"
      >
        <span className="flex-1">{message}</span>
        <button
          onClick={() => {
            setShown(false);
            onDismiss?.();
          }}
          className="text-bg/70 hover:text-bg text-xs uppercase tracking-wide"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
