// ──────────────────────────────────────────────────────────
// Share grid — Wordle-shape result string
// ──────────────────────────────────────────────────────────
//
// Format:
//
//   Outloud · 2026-05-03
//   ✅✅✅⬜✅✅✅✅  7/8 in 1:42
//   🔥 Streak 5
//   outloud.app
//
// ⬜ = wrong, ✅ = correct. One emoji per problem in order.
//
// ──────────────────────────────────────────────────────────

import type { Result, Session, StreakState } from "./types";

export function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function buildEmojiRow(results: Result[]): string {
  return results.map((r) => (r.correct ? "✅" : "⬜")).join("");
}

export function buildShareString(
  session: Session,
  streak: StreakState,
): string {
  const correctCount = session.results.filter((r) => r.correct).length;
  const totalMs = session.results.reduce((sum, r) => sum + r.elapsedMs, 0);
  const lines = [
    `Outloud · ${session.date}`,
    `${buildEmojiRow(session.results)}  ${correctCount}/${session.results.length} in ${formatDuration(totalMs)}`,
    `🔥 Streak ${streak.current}`,
    "outloud.app",
  ];
  return lines.join("\n");
}

/**
 * Try to copy text to the clipboard. Returns true on success, false on failure
 * (Safari private mode, missing permissions, no clipboard API). UI must handle
 * the false case by showing the text for manual copy.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator === "undefined" || !navigator.clipboard) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
