// ──────────────────────────────────────────────────────────
// Answer parsing + tolerance comparison
// ──────────────────────────────────────────────────────────
//
// Inputs we accept (case-insensitive, whitespace-tolerant):
//
//   "1700000"     → 1700000
//   "1,700,000"   → 1700000
//   "1.7M"        → 1700000
//   "1700K"       → 1700000
//   "1.7m"        → 1700000
//   "42"          → 42
//   "42.5"        → 42.5
//   "42%"         → 42
//   "$25"         → 25
//
// Comparison uses tolerance:
//   - explicit per-problem tolerance if set
//   - else 0.01 (1%) of the answer for percentages and answers > 100
//   - else exact match (integer answers under 100)
//
// ──────────────────────────────────────────────────────────

import type { Problem } from "./types";

const SUFFIX_MULTIPLIERS: Record<string, number> = {
  k: 1_000,
  m: 1_000_000,
  b: 1_000_000_000,
};

/**
 * Parse user input into a number. Returns null on unparseable input.
 * Does not throw.
 */
export function parseAnswer(raw: string): number | null {
  if (typeof raw !== "string") return null;

  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[\s,$]/g, "")
    .replace(/%$/, "");

  if (cleaned === "" || cleaned === "-" || cleaned === ".") return null;

  // Match: optional sign, digits, optional decimal, optional suffix (k/m/b).
  const match = cleaned.match(/^(-?\d*\.?\d+)([kmb])?$/);
  if (!match) return null;

  const numericPart = parseFloat(match[1]);
  if (Number.isNaN(numericPart) || !Number.isFinite(numericPart)) return null;

  const suffix = match[2];
  const multiplier = suffix ? SUFFIX_MULTIPLIERS[suffix] : 1;

  return numericPart * multiplier;
}

/**
 * Default tolerance for a given correct answer.
 *   - Percentages and large numbers: 1% of the answer.
 *   - Small integer-ish answers: exact match.
 */
export function defaultTolerance(correctAnswer: number): number {
  const absAns = Math.abs(correctAnswer);
  if (absAns >= 100) return absAns * 0.01;
  if (!Number.isInteger(correctAnswer)) return Math.max(absAns * 0.01, 0.05);
  return 0; // exact match for small integers
}

/**
 * Check whether a parsed answer is correct for a problem, using either the
 * problem's explicit tolerance or the default.
 */
export function isCorrect(parsed: number | null, problem: Problem): boolean {
  if (parsed === null || !Number.isFinite(parsed)) return false;
  const tol = problem.tolerance ?? defaultTolerance(problem.answer);
  return Math.abs(parsed - problem.answer) <= tol;
}
