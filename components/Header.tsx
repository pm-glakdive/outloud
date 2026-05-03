"use client";

import type { StreakState, UserSettings } from "@/lib/types";

interface HeaderProps {
  streak: StreakState;
  settings: UserSettings;
  onToggleMode: () => void;
}

export function Header({ streak, settings, onToggleMode }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Napkin</h1>
        <p className="text-xs text-ink-muted mt-0.5">
          Daily mental math · {streak.current > 0 ? `${streak.current}-day streak` : "Day 1"}
        </p>
      </div>
      <button
        onClick={onToggleMode}
        className="text-xs uppercase tracking-wide text-ink-subtle hover:text-ink border border-ink-muted/30 hover:border-ink-muted rounded-full px-3 py-1.5 transition-colors"
        aria-label={`Switch to ${settings.mode === "context" ? "pure math" : "context"} mode (applies next puzzle)`}
        title="Toggle context vs pure math (applies to next puzzle)"
      >
        {settings.mode === "context" ? "Context" : "Pure"}
      </button>
    </header>
  );
}
