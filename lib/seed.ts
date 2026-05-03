// ──────────────────────────────────────────────────────────
// Deterministic daily problem selection
// ──────────────────────────────────────────────────────────
//
// Goal: same date → same problem set, identical for everyone in the same
// local-date timezone bucket.
//
// Pipeline:
//
//   localDate ──hash──▶ uint32 seed ──mulberry32──▶ RNG ──pickN──▶ Problem[]
//
// We use a non-cryptographic 32-bit seed because we just need
// reproducibility, not security.
//
// ──────────────────────────────────────────────────────────

import type { Problem } from "./types";

/**
 * Local date as YYYY-MM-DD in the user's timezone. Decision A1 from eng review:
 * puzzle rolls at user's local midnight (Wordle-shape), not UTC.
 */
export function localDateString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Tiny 32-bit hash of a string. Not crypto. Good enough for seeding an RNG.
 * Based on the cyrb53/cyrb32 family. Deterministic across browsers.
 */
export function hashSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Mulberry32 PRNG. Returns a function that yields floats in [0, 1).
 * Deterministic given the seed.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Pick `n` distinct items from `bank` deterministically given the seed.
 * Uses partial Fisher-Yates: stable, no bias, O(n).
 */
export function pickN<T>(bank: readonly T[], n: number, seed: number): T[] {
  if (n <= 0 || bank.length === 0) return [];
  const count = Math.min(n, bank.length);
  const arr = bank.slice();
  const rng = mulberry32(seed);
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(rng() * (arr.length - i));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

/**
 * Pick today's problem set. Pure function of the date string and the bank.
 *
 * Determinism contract:
 *   pickDaily('2026-05-03', bank, 8) === pickDaily('2026-05-03', bank, 8)
 * for any number of calls, in any browser.
 */
export function pickDaily(
  dateString: string,
  bank: readonly Problem[],
  count: number,
): Problem[] {
  const seed = hashSeed(dateString);
  return pickN(bank, count, seed);
}
