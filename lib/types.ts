// ──────────────────────────────────────────────────────────
// Core types
// ──────────────────────────────────────────────────────────
//
//   Problem  → one math question with two phrasings (context + pure).
//   Result   → user's answer to a Problem, with timing.
//   Session  → today's full daily attempt, in progress or complete.
//
// State machine:
//
//   idle ──start──▶ in_progress ──submit─▶ in_progress ──last submit─▶ complete
//                       │                       │
//                       └──refresh──────────────┘  (state recovered from localStorage)
//
// ──────────────────────────────────────────────────────────

export type Category =
  | "percentage"
  | "ratio"
  | "arithmetic"
  | "sizing"
  | "split"
  | "conversion"
  | "delta";

export interface Problem {
  /** Stable id used for testing and result hashing. */
  id: string;
  category: Category;
  /** Both phrasings of the same underlying math. */
  prompt: {
    context: string; // e.g. "MAU went 1.2M → 1.7M, WoW % growth?"
    pure: string;    // e.g. "(1.7 - 1.2) / 1.2 = ?"
  };
  /** Numeric answer, in canonical form. Percentages are stored as numbers (42 not 0.42). */
  answer: number;
  /** Acceptable absolute tolerance. Default per category in answer.ts. */
  tolerance?: number;
  /** "Method" reveal text shown after submit. Replaces the original "trick" framing. */
  method: string;
  /** 1 = easy, 2 = medium, 3 = hard. Used later for adaptive weighting. */
  difficulty: 1 | 2 | 3;
}

export interface Result {
  problemId: string;
  /** Raw text the user typed. */
  rawAnswer: string;
  /** Parsed numeric answer, or null if unparseable. */
  parsedAnswer: number | null;
  /** Whether the parsed answer was within tolerance of the correct answer. */
  correct: boolean;
  /** Milliseconds spent on this problem. Excludes time spent backgrounded if we add that later. */
  elapsedMs: number;
}

export type SessionStatus =
  | "idle" // not started today
  | "answering" // current problem on screen, waiting for input
  | "reviewing" // user just submitted, method reveal showing, waiting for "Next"
  | "complete"; // all problems done, result screen showing

export interface Session {
  /** Local date YYYY-MM-DD this session belongs to. */
  date: string;
  /** Display mode. Settings toggle changes the NEXT session, not mid-stream. */
  mode: "context" | "pure";
  /** Fixed problem set for this date. */
  problems: Problem[];
  /** Index of the current problem in `problems`. */
  currentIndex: number;
  /** Results so far; length === currentIndex when in_progress. */
  results: Result[];
  status: SessionStatus;
  /** Wall-clock ms when current problem was shown. Used to compute elapsedMs on submit. */
  currentProblemStartedAt: number | null;
}

export interface StreakState {
  /** Current consecutive-day count. */
  current: number;
  /** All-time best streak. */
  best: number;
  /** Local date YYYY-MM-DD of the last completed daily. */
  lastCompletedDate: string | null;
}

export interface UserSettings {
  mode: "context" | "pure";
}
