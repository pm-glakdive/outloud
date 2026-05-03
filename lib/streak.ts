// ──────────────────────────────────────────────────────────
// Streak math
// ──────────────────────────────────────────────────────────
//
// Decision A2 from eng review: 36-hour grace window. Travelers and DST
// shifts don't break a streak.
//
// Day diff calculation:
//
//   yesterday  → +1 (extend)
//   today      → no change (already counted)
//   <= 36h     → +1 (grace)
//   > 36h      → reset to 1
//
// ──────────────────────────────────────────────────────────

import type { StreakState } from "./types";

const GRACE_WINDOW_MS = 36 * 60 * 60 * 1000; // 36 hours

/**
 * Parse a YYYY-MM-DD string into a Date at LOCAL midnight (not UTC).
 * Critical: avoid `new Date('2026-05-03')` which parses as UTC midnight.
 */
function parseLocalDate(dateString: string): Date {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

/**
 * Pure streak math. Given the current streak state, the date the user just
 * completed, and (optionally) the current time, return the new state.
 *
 * @param prev  current streak state (may be a fresh-zero state)
 * @param completedDate  YYYY-MM-DD local date of the just-completed daily
 * @param now  current Date (defaults to new Date(); injectable for tests)
 */
export function extendStreak(
  prev: StreakState,
  completedDate: string,
  now: Date = new Date(),
): StreakState {
  // Already counted today → no-op.
  if (prev.lastCompletedDate === completedDate) {
    return prev;
  }

  // First-ever completion.
  if (prev.lastCompletedDate === null) {
    const next = 1;
    return {
      current: next,
      best: Math.max(prev.best, next),
      lastCompletedDate: completedDate,
    };
  }

  const completedAt = parseLocalDate(completedDate).getTime();
  const lastAt = parseLocalDate(prev.lastCompletedDate).getTime();
  const gap = completedAt - lastAt;

  // Within 36 hours = consecutive.
  if (gap > 0 && gap <= GRACE_WINDOW_MS) {
    const next = prev.current + 1;
    return {
      current: next,
      best: Math.max(prev.best, next),
      lastCompletedDate: completedDate,
    };
  }

  // Long gap → reset.
  return {
    current: 1,
    best: Math.max(prev.best, 1),
    lastCompletedDate: completedDate,
  };
}

export const FRESH_STREAK: StreakState = {
  current: 0,
  best: 0,
  lastCompletedDate: null,
};
