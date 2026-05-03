"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { Header } from "@/components/Header";
import { ProblemCard } from "@/components/ProblemCard";
import { ResultScreen } from "@/components/ResultScreen";
import { Toast } from "@/components/Toast";

/**
 * Top-level orchestrator.
 *
 * Render branches map directly to session.status:
 *
 *   not hydrated → skeleton (avoid hydration mismatch)
 *   idle         → "Start today's puzzle" CTA
 *   answering    → ProblemCard (input visible, no reveal)
 *   reviewing    → ProblemCard (reveal panel visible, "Next" CTA)
 *   complete     → ResultScreen
 *
 * Safety nets (eng review decision):
 *   - storageOK=false → toast warning streak won't save
 *   - clipboard fail  → toast with copy-this-manually text
 */
export default function Home() {
  const {
    session,
    streak,
    settings,
    storageOK,
    hydrated,
    hydrate,
    startToday,
    submitCurrent,
    advanceNext,
    setMode,
  } = useApp();

  const [toast, setToast] = useState<string | null>(null);
  const [storageWarned, setStorageWarned] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (hydrated && !storageOK && !storageWarned) {
      setToast(
        "Browser storage unavailable. Your streak won't be saved this session.",
      );
      setStorageWarned(true);
    }
  }, [hydrated, storageOK, storageWarned]);

  if (!hydrated) {
    return <Skeleton />;
  }

  const handleToggleMode = () => {
    setMode(settings.mode === "context" ? "pure" : "context");
  };

  const handleClipboardFail = (text: string) => {
    setToast(`Clipboard blocked. Copy this manually:\n\n${text}`);
  };

  const status = session?.status ?? "idle";
  const lastResult =
    session && session.results.length > 0
      ? session.results[session.results.length - 1]
      : null;

  return (
    <>
      <Header
        streak={streak}
        settings={settings}
        onToggleMode={handleToggleMode}
      />

      {status === "idle" && (
        <IdleScreen onStart={startToday} streakCount={streak.current} />
      )}

      {(status === "answering" || status === "reviewing") && session && (
        <ProblemCard
          // Force remount on problem change to reset internal input state.
          key={`${session.problems[session.currentIndex]?.id}-${status}`}
          problem={session.problems[session.currentIndex]}
          mode={session.mode}
          index={session.currentIndex}
          total={session.problems.length}
          onSubmit={submitCurrent}
          onNext={advanceNext}
          isReviewing={status === "reviewing"}
          lastResult={status === "reviewing" ? lastResult : null}
        />
      )}

      {status === "complete" && session && (
        <ResultScreen
          session={session}
          streak={streak}
          onClipboardFail={handleClipboardFail}
        />
      )}

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </>
  );
}

interface IdleScreenProps {
  onStart: () => void;
  streakCount: number;
}

function IdleScreen({ onStart, streakCount }: IdleScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-semibold tracking-tight mb-2">
        Today&apos;s puzzle
      </h2>
      <p className="text-sm text-ink-subtle max-w-xs mb-8">
        8 mental-math problems. Mostly things you actually do at work. Aim for
        under 3 minutes.
      </p>
      <button
        onClick={onStart}
        className="bg-ink text-bg rounded-xl px-8 py-4 text-sm font-medium uppercase tracking-wide hover:bg-ink/90 transition-colors"
      >
        Start
      </button>
      {streakCount > 0 && (
        <p className="mt-6 text-xs text-ink-muted">
          🔥 {streakCount}-day streak. Keep it alive.
        </p>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-ink-muted text-sm">Loading…</div>
    </div>
  );
}
