"use client";

import { useState } from "react";
import type { UserSettings } from "@/lib/types";
import { Switch } from "./Switch";

interface IdleScreenProps {
  onStart: () => void;
  streakCount: number;
  settings: UserSettings;
  onToggleMode: () => void;
}

type IdleStep = "welcome" | "preview";

/**
 * Two-step idle flow:
 *
 *   welcome → brand + tight intro + Get started
 *   preview → today's puzzle (count, time, topics, mode toggle) + Start
 *
 * The Header is hidden by the parent during idle, so each step owns its
 * full visual identity. No double-Outloud, no awkward Day-1 indicator
 * before any day has been completed.
 */
export function IdleScreen({
  onStart,
  streakCount,
  settings,
  onToggleMode,
}: IdleScreenProps) {
  const [step, setStep] = useState<IdleStep>("welcome");

  if (step === "welcome") {
    return <WelcomeStep onContinue={() => setStep("preview")} />;
  }

  return (
    <PreviewStep
      onStart={onStart}
      streakCount={streakCount}
      settings={settings}
      onToggleMode={onToggleMode}
    />
  );
}

interface WelcomeStepProps {
  onContinue: () => void;
}

function WelcomeStep({ onContinue }: WelcomeStepProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
      <h2 className="text-3xl font-semibold tracking-tight mb-3">Outloud</h2>
      <p className="text-base text-ink-subtle max-w-sm leading-relaxed mb-3">
        Mental math for your workday.
      </p>
      <p className="text-sm text-ink-muted max-w-sm leading-relaxed mb-10">
        Daily shortcuts to skip the paper and pencil.
      </p>
      <button
        onClick={onContinue}
        className="bg-ink text-bg rounded-xl px-8 py-4 text-sm font-medium uppercase tracking-wide hover:bg-ink/90 transition-colors"
      >
        Get started
      </button>
    </div>
  );
}

interface PreviewStepProps {
  onStart: () => void;
  streakCount: number;
  settings: UserSettings;
  onToggleMode: () => void;
}

/**
 * Topics covered in the v0.2 problem bank, listed for the user so they
 * know what's coming. Keep this label list aligned with the categories
 * that exist in lib/problems.ts.
 */
const TODAY_TOPICS = [
  "Percentages",
  "Ratios",
  "Multiplication shortcuts",
  "Sizing",
  "Splits",
  "Conversions",
  "Growth deltas",
];

function PreviewStep({
  onStart,
  streakCount,
  settings,
  onToggleMode,
}: PreviewStepProps) {
  const showingScenarios = settings.mode === "context";
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center -mt-4">
        <p className="text-xs text-ink-muted uppercase tracking-wider mb-2">
          Ready?
        </p>
        <h2 className="text-2xl font-semibold tracking-tight mb-5">
          3 minutes of math. No pencil required.
        </h2>

        <div className="max-w-xs mb-8">
          <p className="text-xs text-ink-muted uppercase tracking-wider mb-2">
            Topics today
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {TODAY_TOPICS.map((topic) => (
              <span
                key={topic}
                className="text-xs text-ink-subtle bg-bg-subtle border border-ink-muted/15 rounded-full px-2.5 py-1"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onStart}
          className="bg-ink text-bg rounded-xl px-10 py-4 text-sm font-medium uppercase tracking-wide hover:bg-ink/90 transition-colors"
        >
          Start
        </button>
        {streakCount > 0 && (
          <p className="mt-6 text-xs text-ink-muted">
            🔥 {streakCount}-day streak. Keep it alive.
          </p>
        )}
      </div>

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={onToggleMode}
          className="w-full flex items-start justify-between rounded-xl border border-ink-muted/15 bg-bg-subtle px-4 py-3 text-left hover:opacity-90 transition-opacity"
          aria-label="Toggle question format"
        >
          <div className="pr-3">
            <p className="text-sm text-ink">Format</p>
            <p className="text-xs text-ink-muted mt-0.5">
              {showingScenarios
                ? "On — numbers are wrapped in professional workplace examples."
                : "Off — numbers are presented as standard math strings."}
            </p>
          </div>
          <Switch
            checked={showingScenarios}
            onChange={onToggleMode}
            label="Toggle question format"
          />
        </button>
      </div>
    </div>
  );
}
