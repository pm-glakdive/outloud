// ──────────────────────────────────────────────────────────
// Problem bank — v0.2
// ──────────────────────────────────────────────────────────
//
// Hand-authored seed bank. Each problem ships with a TWO-PART method:
//
//   why  → the principle that makes the shortcut work (one sentence)
//   how  → the actual mental steps in plain English (one sentence)
//
// Constraint imposed by user feedback: methods must be HEAD-COMPUTABLE.
// No formulas with letters, no "(n ÷ 4)" notation, no symbols a real
// person wouldn't say out loud. The test: if you can't mutter the method
// to yourself in a meeting and have it land in 5 seconds, rewrite it.
//
// Categories represented: percentage, ratio, arithmetic, sizing, split,
// conversion, delta. Aim for 30-50 problems before launch.
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
    method: {
      why: "Percent change is always: change ÷ where you started. Anchor on a familiar fraction (here, half).",
      how: "Change is 0.5 on a base of 1.2. Half of 1.2 is 0.6, so 0.5 is a bit less than half (= 50%). Land at ~42%.",
    },
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
    method: {
      why: "If the change goes into the original a clean number of times, the percent is just one over that.",
      how: "Drop is 120. 120 fits into 480 four times. One over four is 25%.",
    },
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
    method: {
      why: "15% is just 10% plus half of 10%. Tens are easy because you slide the decimal.",
      how: "10% of 80 is 8. Half of 8 is 4. Add: 12.",
    },
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
    method: {
      why: "20% is easy (double the 10%). 18% is just 20% minus a tiny adjustment.",
      how: "10% is about 8.6. Double for 20%: 17.2. Take a couple of bucks off for the 2% gap: roughly 15.5.",
    },
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
    method: {
      why: "A ratio is just a divide.",
      how: "21 over 7 is 3. Three engineers per PM.",
    },
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
    method: {
      why: "Big numbers feel scary. Small ones are obvious. If you drop the same number of zeros from both sides, the percent doesn't change.",
      how: "12,000 and 3,000 → drop three zeros from both → 12 and 3. 3 fits into 12 four times, so 3 is a quarter of 12 = 25%.",
    },
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
    method: {
      why: "100 is the easiest number to multiply by — just stick on two zeros. And 25 is exactly a quarter of 100. So multiply by 100 first (easy), then take a quarter of the result.",
      how: "28 × 100 = 2800. A quarter of 2800 is 700.",
    },
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
    method: {
      why: "Two numbers that sit one above and one below a round middle multiply to (middle squared) − (gap squared). It feels magical but it's always true.",
      how: "Both sandwich 20. 20 squared is 400. They're 1 away from 20, so subtract 1 squared (= 1). Answer: 399.",
    },
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
    method: {
      why: "Round one number to something easy, multiply, then take back the extra.",
      how: "Pretend 47 is 50: that's 300. Then take off three sixes (18). Leaves 282.",
    },
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
    method: {
      why: "48 × 48 is hard. 48 × 50 is easy (any number times 50 = times 100, halved). Then adjust: 48 × 50 has two extra columns of 48, so subtract them.",
      how: "48 × 50 = 2400 (think 48 × 100 = 4800, halved). Then take off two 48s (= 96): 2400 − 96 = 2304.",
    },
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
    method: {
      why: "Split a tricky decimal into easy chunks: 0.0012 = 0.001 + 0.0002.",
      how: "0.001 of 4M is 4000. 0.0002 of 4M is 800. Add: 4800.",
    },
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
    method: {
      why: "Round to a clean number, multiply, then add back the leftover.",
      how: "8000 × 4 is 32,000. The extra 200 × 4 is 800. Total: 32,800.",
    },
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
    method: {
      why: "Add the tip first (round numbers help), then divide by the split. Don't try to do both at once.",
      how: "86.40 plus 18% is about 102. 102 split four ways is roughly 25.50. Each pays about $25.",
    },
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
    method: {
      why: "Match the units first (turn 2.4s into 2400ms). Then it's a clean divide.",
      how: "2400 over 800 is 3. We need to be 3× faster.",
    },
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
    method: {
      why: "Relative change = change ÷ where you started. To make small decimals friendlier, multiply both top and bottom by 10.",
      how: "Change is 0.9. Multiply both by 10: 9 over 42. That's just over 1/5 (= 20%), so call it 21%.",
    },
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
    method: {
      why: "Look for clean fractions. 35 is 5 sevens; 21 is 3 sevens; so 21 over 35 is just 3 over 5.",
      how: "Change is 21. 21 over 35 = 3/5 = 60%.",
    },
    difficulty: 2,
  },
];

/** Number of problems served per daily challenge. */
export const DAILY_COUNT = 8;
