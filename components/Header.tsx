"use client";

import type { StreakState } from "@/lib/types";

interface HeaderProps {
  streak: StreakState;
  /** When true, render the slim header used during play. */
  compact?: boolean;
}

/**
 * Two render modes:
 *
 *   compact=false (idle/complete) → name + tagline + streak
 *   compact=true  (answering/reviewing) → name + streak in one row, no tagline
 *
 * The mode toggle lives on the IdleScreen instead of in the header, so during
 * play there's no chrome competing with the question for attention.
 */
export function Header({ streak, compact = false }: HeaderProps) {
  // Hide the streak indicator entirely when the user hasn't completed any day yet.
  // Showing "Day 1" before they've done anything reads as misleading status.
  const streakBadge = streak.current > 0;

  if (compact) {
    return (
      <header className="flex items-baseline justify-between mb-5">
        <h1 className="text-base font-semibold tracking-tight">Outloud</h1>
        {streakBadge && (
          <span className="text-xs text-ink-muted num">
            🔥 {streak.current}
          </span>
        )}
      </header>
    );
  }

  return (
    <header className="mb-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Outloud</h1>
        {streakBadge && (
          <span className="text-xs text-ink-muted shrink-0 ml-3 num">
            🔥 {streak.current}-day streak
          </span>
        )}
      </div>
    </header>
  );
}
