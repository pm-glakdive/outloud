// ──────────────────────────────────────────────────────────
// Zustand store — session + streak + settings
// ──────────────────────────────────────────────────────────
//
// Three independent slices:
//
//   session   → today's run (volatile-ish; persisted so refresh recovers)
//   streak    → user's running streak (persisted)
//   settings  → context vs pure-math (persisted; takes effect NEXT puzzle)
//
// Persistence strategy: per-slice keys in localStorage, each guarded by
// a try/catch so quota errors / private mode don't crash the app.
// On any persistence failure, we set `storageOK: false` so the UI can
// surface a toast (decision: critical safety net from eng review).
//
// State machine for session:
//
//   no session today        ──start──▶  in_progress
//   in_progress (n problems) ──submit──▶  in_progress (n-1) or complete
//   complete                 ──reset on new day──▶  no session
//
// ──────────────────────────────────────────────────────────

import { create } from "zustand";
import type {
  Problem,
  Result,
  Session,
  StreakState,
  UserSettings,
} from "./types";
import { localDateString, pickDaily } from "./seed";
import { extendStreak, FRESH_STREAK } from "./streak";
import { isCorrect, parseAnswer } from "./answer";
import { DAILY_COUNT, PROBLEM_BANK } from "./problems";

const STORAGE_KEYS = {
  session: "napkin:session",
  streak: "napkin:streak",
  settings: "napkin:settings",
} as const;

const DEFAULT_SETTINGS: UserSettings = { mode: "context" };

interface AppState {
  session: Session | null;
  streak: StreakState;
  settings: UserSettings;
  /** False when localStorage write/read failed. UI can surface a toast. */
  storageOK: boolean;
  /** True after first hydrate from localStorage on the client. */
  hydrated: boolean;

  hydrate: () => void;
  startToday: () => void;
  /** Phase 1: record the answer for the current problem; flip to "reviewing". */
  submitCurrent: (rawAnswer: string) => void;
  /** Phase 2: advance to the next problem (or to "complete" if last). */
  advanceNext: () => void;
  setMode: (mode: UserSettings["mode"]) => void;
  resetForNewDay: () => void;
}

function safeLocalGet(key: string): string | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalSet(key: string, value: string): boolean {
  try {
    if (typeof window === "undefined") return false;
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function buildFreshSession(mode: UserSettings["mode"]): Session {
  const date = localDateString();
  const problems: Problem[] = pickDaily(date, PROBLEM_BANK, DAILY_COUNT);
  return {
    date,
    mode,
    problems,
    currentIndex: 0,
    results: [],
    status: "answering",
    currentProblemStartedAt: Date.now(),
  };
}

export const useApp = create<AppState>((set, get) => ({
  session: null,
  streak: FRESH_STREAK,
  settings: DEFAULT_SETTINGS,
  storageOK: true,
  hydrated: false,

  hydrate: () => {
    const today = localDateString();
    let storageOK = true;

    // Settings.
    let settings = DEFAULT_SETTINGS;
    const rawSettings = safeLocalGet(STORAGE_KEYS.settings);
    if (rawSettings) {
      try {
        const parsed = JSON.parse(rawSettings) as UserSettings;
        if (parsed.mode === "context" || parsed.mode === "pure") {
          settings = parsed;
        }
      } catch {
        storageOK = false;
      }
    }

    // Streak.
    let streak = FRESH_STREAK;
    const rawStreak = safeLocalGet(STORAGE_KEYS.streak);
    if (rawStreak) {
      try {
        streak = JSON.parse(rawStreak) as StreakState;
      } catch {
        storageOK = false;
      }
    }

    // Session — only restore if it's still today's date.
    let session: Session | null = null;
    const rawSession = safeLocalGet(STORAGE_KEYS.session);
    if (rawSession) {
      try {
        const parsed = JSON.parse(rawSession) as Session;
        if (parsed.date === today) {
          // Reset the per-problem timer to "now" on rehydrate so the
          // user doesn't get penalized for time spent away.
          session = {
            ...parsed,
            currentProblemStartedAt:
              parsed.status === "answering" ? Date.now() : null,
          };
        }
      } catch {
        storageOK = false;
      }
    }

    set({ session, streak, settings, storageOK, hydrated: true });
  },

  startToday: () => {
    const { settings, session } = get();
    const today = localDateString();
    if (session && session.date === today) return; // already started
    const fresh = buildFreshSession(settings.mode);
    const ok = safeLocalSet(STORAGE_KEYS.session, JSON.stringify(fresh));
    set({ session: fresh, storageOK: ok && get().storageOK });
  },

  submitCurrent: (rawAnswer: string) => {
    const { session } = get();
    if (!session || session.status !== "answering") return;
    const problem = session.problems[session.currentIndex];
    if (!problem) return;

    const startedAt = session.currentProblemStartedAt ?? Date.now();
    const elapsedMs = Math.max(0, Date.now() - startedAt);
    const parsedAnswer = parseAnswer(rawAnswer);
    const correct = isCorrect(parsedAnswer, problem);

    const result: Result = {
      problemId: problem.id,
      rawAnswer,
      parsedAnswer,
      correct,
      elapsedMs,
    };

    const nextSession: Session = {
      ...session,
      results: [...session.results, result],
      // currentIndex stays the same — we're now reviewing the just-answered question.
      status: "reviewing",
      currentProblemStartedAt: null,
    };

    const okSession = safeLocalSet(
      STORAGE_KEYS.session,
      JSON.stringify(nextSession),
    );

    set({
      session: nextSession,
      storageOK: get().storageOK && okSession,
    });
  },

  advanceNext: () => {
    const { session, streak } = get();
    if (!session || session.status !== "reviewing") return;

    const nextIndex = session.currentIndex + 1;
    const isLast = nextIndex >= session.problems.length;

    const nextSession: Session = {
      ...session,
      currentIndex: isLast ? session.currentIndex : nextIndex,
      status: isLast ? "complete" : "answering",
      currentProblemStartedAt: isLast ? null : Date.now(),
    };

    let nextStreak = streak;
    if (isLast) {
      nextStreak = extendStreak(streak, session.date);
    }

    const okSession = safeLocalSet(
      STORAGE_KEYS.session,
      JSON.stringify(nextSession),
    );
    const okStreak = isLast
      ? safeLocalSet(STORAGE_KEYS.streak, JSON.stringify(nextStreak))
      : true;

    set({
      session: nextSession,
      streak: nextStreak,
      storageOK: get().storageOK && okSession && okStreak,
    });
  },

  setMode: (mode) => {
    const next: UserSettings = { mode };
    const ok = safeLocalSet(STORAGE_KEYS.settings, JSON.stringify(next));
    set({ settings: next, storageOK: get().storageOK && ok });
  },

  resetForNewDay: () => {
    set({ session: null });
    try {
      window.localStorage.removeItem(STORAGE_KEYS.session);
    } catch {
      /* ignore */
    }
  },
}));
