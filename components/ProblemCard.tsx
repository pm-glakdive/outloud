"use client";

import { useEffect, useRef, useState } from "react";
import type { Problem, Result } from "@/lib/types";

interface ProblemCardProps {
  problem: Problem;
  mode: "context" | "pure";
  index: number;
  total: number;
  onSubmit: (raw: string) => void;
  onNext: () => void;
  isReviewing: boolean;
  /** The result for THIS problem (set when isReviewing is true). */
  lastResult: Result | null;
}

/**
 * One problem at a time. Two render phases:
 *
 *   isReviewing=false → input visible, submit button active, no reveal
 *   isReviewing=true  → input frozen, reveal panel + Next button visible
 *
 * State machine is owned by the store; this component is purely presentational
 * for the input/reveal split.
 */
export function ProblemCard({
  problem,
  mode,
  index,
  total,
  onSubmit,
  onNext,
  isReviewing,
  lastResult,
}: ProblemCardProps) {
  const [raw, setRaw] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // Focus management:
  //   - answering phase → focus input
  //   - reviewing phase → focus Next button so Enter advances
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (isReviewing) {
        nextRef.current?.focus();
      } else {
        setRaw("");
        inputRef.current?.focus();
      }
    }, 50);
    return () => window.clearTimeout(id);
  }, [problem.id, isReviewing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReviewing) return;
    if (raw.trim() === "") return;
    onSubmit(raw);
  };

  const promptText =
    mode === "context" ? problem.prompt.context : problem.prompt.pure;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between text-xs text-ink-muted uppercase tracking-wider mb-3">
        <span>
          Question {index + 1} of {total}
        </span>
        <span>{problem.category}</span>
      </div>

      <div className="bg-bg-card border border-ink-muted/15 rounded-2xl p-6 mb-4 shadow-sm">
        <p className="text-lg leading-snug">{promptText}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={isReviewing ? lastResult?.rawAnswer ?? "" : raw}
          onChange={(e) => setRaw(e.target.value)}
          disabled={isReviewing}
          placeholder="Your answer"
          className="num flex-1 bg-bg-card border border-ink-muted/30 rounded-xl px-4 py-3 text-lg outline-none focus:border-ink disabled:opacity-60"
          aria-label="Your answer"
        />
        {!isReviewing && (
          <button
            type="submit"
            disabled={raw.trim() === ""}
            className="bg-ink text-bg rounded-xl px-5 py-3 text-sm font-medium uppercase tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        )}
      </form>

      {isReviewing && lastResult && (
        <>
          <RevealPanel problem={problem} result={lastResult} />
          <button
            ref={nextRef}
            onClick={onNext}
            className="bg-ink text-bg rounded-xl px-5 py-4 mt-4 text-sm font-medium uppercase tracking-wide hover:bg-ink/90 transition-colors"
          >
            {index + 1 === total ? "See result" : "Next"}
          </button>
        </>
      )}
    </div>
  );
}

interface RevealPanelProps {
  problem: Problem;
  result: Result;
}

function RevealPanel({ problem, result }: RevealPanelProps) {
  const correct = result.correct;
  return (
    <div
      className={`rounded-2xl border p-5 ${
        correct
          ? "border-accent/30 bg-accent/5"
          : "border-accent-warm/30 bg-accent-warm/5"
      }`}
    >
      <div className="flex items-baseline justify-between mb-3">
        <span
          className={`text-sm font-medium uppercase tracking-wide ${
            correct ? "text-accent" : "text-accent-warm"
          }`}
        >
          {correct ? "Correct" : "Not quite"}
        </span>
        <span className="text-xs text-ink-muted num">
          {(result.elapsedMs / 1000).toFixed(1)}s
        </span>
      </div>
      {!correct && (
        <p className="text-sm text-ink-subtle mb-3">
          You said{" "}
          <span className="num font-medium text-ink">
            {result.parsedAnswer ?? (result.rawAnswer || "—")}
          </span>
          . Answer:{" "}
          <span className="num font-medium text-ink">{problem.answer}</span>.
        </p>
      )}
      <div>
        <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">
          Method
        </p>
        <p className="text-sm leading-relaxed text-ink">{problem.method}</p>
      </div>
    </div>
  );
}
