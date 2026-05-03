// ──────────────────────────────────────────────────────────
// Problem bank — v0.1
// ──────────────────────────────────────────────────────────
//
// Hand-authored seed bank. Decision from eng review: every problem has a
// "method" reveal (renamed from "trick"). The method shows the calculation
// the user could do in their head, even when it's not magical.
//
// Structure: { context: realistic PM/analyst scenario, pure: raw math }.
// Settings toggle picks which prompt to show.
//
// Categories represented:
//   percentage, ratio, arithmetic, sizing, split, conversion, delta
//
// Aim for ~30-50 problems before launch. v0.1 has 16 to test the loop.
//
// ──────────────────────────────────────────────────────────

import type { Problem } from "./types";

export const PROBLEM_BANK: Problem[] = [
  // ─── Percentage growth ───
  {
    id: "pct-mau-12-17",
    category: "percentage",
    prompt: {
      context: "MAU went from 1.2M to 1.7M week over week. What's the % growth?",
      pure: "(1.7 − 1.2) / 1.2 = ? (express as a percentage)",
    },
    answer: 41.67,
    method: "Δ = 0.5. 0.5 / 1.2 ≈ 0.417, so ≈ 42%. Mental shortcut: 0.5/1.2 ≈ 5/12 ≈ 0.417.",
    difficulty: 2,
  },
  {
    id: "pct-revenue-shrink",
    category: "percentage",
    prompt: {
      context: "Revenue dropped from $480K to $360K this quarter. What % decline?",
      pure: "(480 − 360) / 480 = ? (as a percentage)",
    },
    answer: 25,
    method: "Δ = 120. 120 / 480 = 1/4 = 25%. Tip: spot the clean ratio first.",
    difficulty: 1,
  },

  // ─── Quick percent of round numbers ───
  {
    id: "pct-15-of-80",
    category: "percentage",
    prompt: {
      context: "Bill is $80. You want a 15% tip. How much?",
      pure: "15% of 80 = ?",
    },
    answer: 12,
    method: "10% of 80 = 8. Half of that = 4. 8 + 4 = 12.",
    difficulty: 1,
  },
  {
    id: "pct-18-of-86",
    category: "percentage",
    prompt: {
      context: "Bill is $86.40. You want to leave an 18% tip. How much (rounded)?",
      pure: "18% of 86.40 ≈ ?",
    },
    answer: 15.55,
    tolerance: 0.6,
    method: "10% = 8.64. 20% = 17.28. 18% is 2% less than 20%, so 17.28 − 1.73 ≈ 15.55.",
    difficulty: 3,
  },

  // ─── Ratios ───
  {
    id: "ratio-eng-pm",
    category: "ratio",
    prompt: {
      context: "Your team has 7 PMs and 21 engineers. What's the engineer-to-PM ratio?",
      pure: "21 : 7 = ? : 1",
    },
    answer: 3,
    method: "21 ÷ 7 = 3. Engineer:PM = 3:1.",
    difficulty: 1,
  },
  {
    id: "ratio-funnel-conv",
    category: "ratio",
    prompt: {
      context: "12,000 signups → 3,000 activated. What's the activation rate (%)?",
      pure: "3000 / 12000 = ? (as a percentage)",
    },
    answer: 25,
    method: "3/12 = 1/4 = 25%. Look for the obvious factor first.",
    difficulty: 1,
  },

  // ─── Arithmetic with shortcuts ───
  {
    id: "arith-25x28",
    category: "arithmetic",
    prompt: {
      context: "25 customers each pay $28/mo. What's MRR?",
      pure: "25 × 28 = ?",
    },
    answer: 700,
    method: "25 × n = (n ÷ 4) × 100. 28 ÷ 4 = 7. 7 × 100 = 700.",
    difficulty: 2,
  },
  {
    id: "arith-19x21",
    category: "arithmetic",
    prompt: {
      context: "19 cohorts × 21 users each. Total?",
      pure: "19 × 21 = ?",
    },
    answer: 399,
    method: "Difference of squares: (20−1)(20+1) = 400 − 1 = 399.",
    difficulty: 2,
  },
  {
    id: "arith-47x6",
    category: "arithmetic",
    prompt: {
      context: "47 enterprise seats at $6 add-on. Monthly add-on revenue?",
      pure: "47 × 6 = ?",
    },
    answer: 282,
    method: "(50 × 6) − (3 × 6) = 300 − 18 = 282.",
    difficulty: 1,
  },
  {
    id: "arith-48-sq",
    category: "arithmetic",
    prompt: {
      context: "48 squared, e.g. a 48×48 grid of cells. Total cells?",
      pure: "48² = ?",
    },
    answer: 2304,
    method: "(50 − 2)² = 2500 − 200 + 4 = 2304.",
    difficulty: 3,
  },

  // ─── Sizing / Fermi ───
  {
    id: "sizing-api-cost",
    category: "sizing",
    prompt: {
      context: "Each API call costs $0.0012. You expect 4M calls/day. Daily cost?",
      pure: "0.0012 × 4,000,000 = ?",
    },
    answer: 4800,
    method: "0.001 × 4M = 4000. 0.0002 × 4M = 800. 4000 + 800 = 4800.",
    difficulty: 2,
  },
  {
    id: "sizing-monthly-from-daily",
    category: "sizing",
    prompt: {
      context: "Daily active users: 8,200. Roughly monthly actives if MAU/DAU ≈ 4?",
      pure: "8200 × 4 = ?",
    },
    answer: 32800,
    method: "8000 × 4 = 32,000. 200 × 4 = 800. 32,000 + 800 = 32,800.",
    difficulty: 1,
  },

  // ─── Split / per-person ───
  {
    id: "split-bill-4",
    category: "split",
    prompt: {
      context: "Dinner bill $86.40 + 18% tip, split 4 ways. Each owes (rounded $)?",
      pure: "(86.40 × 1.18) / 4 ≈ ?",
    },
    answer: 25.49,
    tolerance: 1.0,
    method: "86.40 × 1.18 ≈ 102. 102 / 4 ≈ 25.50. Each ≈ $25.",
    difficulty: 3,
  },

  // ─── Conversion ───
  {
    id: "conv-page-load",
    category: "conversion",
    prompt: {
      context: "Page loads in 2.4s. Target is 800ms. How much faster do we need (× factor)?",
      pure: "2400 / 800 = ?",
    },
    answer: 3,
    method: "2.4s = 2400ms. 2400 / 800 = 3. Need to be 3× faster.",
    difficulty: 1,
  },

  // ─── Delta with %, multistep ───
  {
    id: "delta-conv-rate",
    category: "delta",
    prompt: {
      context: "Conversion rate moved from 4.2% to 5.1%. Absolute pp change AND relative % change (relative, rounded)?",
      pure: "Relative: (5.1 − 4.2) / 4.2 ≈ ? (as a percentage)",
    },
    answer: 21.4,
    tolerance: 1.5,
    method: "Δ = 0.9 pp. Relative: 0.9 / 4.2 ≈ 9/42 ≈ 21.4%.",
    difficulty: 3,
  },
  {
    id: "delta-headcount",
    category: "delta",
    prompt: {
      context: "Team grew from 35 to 56. % growth?",
      pure: "(56 − 35) / 35 = ? (as a percentage)",
    },
    answer: 60,
    method: "Δ = 21. 21 / 35 = 3/5 = 60%.",
    difficulty: 2,
  },
];

/** Number of problems served per daily challenge. */
export const DAILY_COUNT = 8;
