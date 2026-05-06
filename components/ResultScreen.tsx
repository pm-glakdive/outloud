"use client";

import { useState } from "react";
import type { Session, StreakState } from "@/lib/types";
import {
  buildEmojiRow,
  buildShareString,
  copyToClipboard,
  formatDuration,
} from "@/lib/share";

interface ResultScreenProps {
  session: Session;
  streak: StreakState;
  onClipboardFail: (text: string) => void;
}

export function ResultScreen({
  session,
  streak,
  onClipboardFail,
}: ResultScreenProps) {
  const [copied, setCopied] = useState(false);
  const correct = session.results.filter((r) => r.correct).length;
  const total = session.results.length;
  const totalMs = session.results.reduce((s, r) => s + r.elapsedMs, 0);
  const accuracy = Math.round((correct / total) * 100);

  const handleShare = async () => {
    const text = buildShareString(session, streak);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      onClipboardFail(text);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-bg-card border border-ink-muted/15 rounded-2xl p-8 mb-6 text-center shadow-sm">
        <p className="text-xs text-ink-muted uppercase tracking-wider mb-2">
          Today · {session.date}
        </p>
        <p className="text-5xl font-semibold tracking-tight num mb-1">
          {formatDuration(totalMs)}
        </p>
        <p className="text-sm text-ink-subtle num">
          {correct}/{total} correct · {accuracy}%
        </p>
        <div className="mt-5 text-2xl tracking-wider">
          {buildEmojiRow(session.results)}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 px-2">
        <div>
          <p className="text-xs text-ink-muted uppercase tracking-wider">Streak</p>
          <p className="text-2xl font-semibold num">🔥 {streak.current}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-muted uppercase tracking-wider">Best</p>
          <p className="text-2xl font-semibold num">{streak.best}</p>
        </div>
      </div>

      <button
        onClick={handleShare}
        className="bg-ink text-bg rounded-xl px-5 py-4 text-sm font-medium uppercase tracking-wide mb-3 hover:bg-ink/90 transition-colors"
      >
        {copied ? "Copied!" : "Share result"}
      </button>

      <p className="text-xs text-center text-ink-muted">
        Come back tomorrow to keep your edge.
      </p>

      <details className="mt-8 text-sm">
        <summary className="cursor-pointer text-ink-subtle uppercase text-xs tracking-wider">
          Review answers
        </summary>
        <ul className="mt-3 space-y-2">
          {session.results.map((r, i) => {
            const p = session.problems[i];
            return (
              <li
                key={r.problemId}
                className="flex items-start gap-3 text-sm border-b border-ink-muted/10 pb-2"
              >
                <span className="num text-ink-muted w-6 shrink-0">{i + 1}.</span>
                <span className="flex-1">
                  <span className="text-ink-subtle">{p.prompt.context}</span>
                  <br />
                  <span className="text-ink-muted text-xs">
                    Answer: <span className="num text-ink">{p.answer}</span> ·{" "}
                    {(r.elapsedMs / 1000).toFixed(1)}s ·{" "}
                    {r.correct ? "✅" : `⬜ (you: ${r.rawAnswer || "—"})`}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </details>
    </div>
  );
}
