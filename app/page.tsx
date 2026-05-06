"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { Header } from "@/components/Header";
import { IdleScreen } from "@/components/IdleScreen";
import { ProblemCard } from "@/components/ProblemCard";
import { ResultScreen } from "@/components/ResultScreen";
import { Toast } from "@/components/Toast";

/**
 * Top-level orchestrator.
 *
 * Render branches map directly to session.status:
 *
 *   not hydrated → skeleton
 *   idle         → IdleScreen (CTA + mode toggle)
 *   answering    → compact header + ProblemCard
 *   reviewing    → compact header + ProblemCard with reveal
 *   complete     → ResultScreen
 *
 * Safety nets:
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
  const compactHeader = status === "answering" || status === "reviewing";
  // Idle owns its own visual identity (Welcome + Preview), no parent header.
  const showHeader = status !== "idle";

  return (
    <>
      {showHeader && <Header streak={streak} compact={compactHeader} />}

      {status === "idle" && (
        <IdleScreen
          onStart={startToday}
          streakCount={streak.current}
          settings={settings}
          onToggleMode={handleToggleMode}
        />
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

function Skeleton() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-ink-muted text-sm">Loading…</div>
    </div>
  );
}
