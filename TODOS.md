# Napkin — TODOs

Items deferred from v1 plan and eng review. Capture context now so future-you understands the why.

---

## v1.1 (close after launch)

### PWA install support
- **What:** Add `manifest.json`, service worker, and "Add to Home Screen" prompt so users can install Napkin like a native app on iOS/Android.
- **Why:** Streak data lives in localStorage. Browser data clears, private windows, and OS-level cleanup wipe streaks. PWA-installed sites get much more durable storage. Eng review flagged this as A4.
- **Pros:** Saves streaks. Faster launch (icon on home screen). Works offline once cached.
- **Cons:** ~3-4 hours of dev. PWA install UX is fiddly on iOS Safari (different prompt mechanics than Chrome).
- **Depends on:** v1 ship + 2-3 weeks of usage data so we know if streak-loss is a real complaint.

### PostHog event tracking
- **What:** Send anonymous events for: `daily_started`, `daily_completed`, `share_clicked`, `setting_changed`. Use a localStorage-generated anonymous device ID.
- **Why:** v1 ships without measurement (per A3 decision). When we want to answer "how many users came back 5 days in a row" or "how many shared their result," we'll need this. PostHog free tier covers it indefinitely for low traffic.
- **Pros:** Concrete answers to success-criteria questions. Cohort retention curves. Funnel between "started" and "completed."
- **Cons:** ~2 hours of integration. Slight bundle size increase (~30KB).
- **Depends on:** A reason to measure (e.g., considering a v2 feature and want data first).

### Toast / snackbar component
- **What:** A minimal toast component for "Streak couldn't be saved" and "Clipboard blocked, copy this manually" fallbacks.
- **Why:** Eng review flagged silent failures as critical gaps. v1 must surface these to the user.
- **Pros:** Users know when something went wrong. They can recover.
- **Cons:** Adds a small UI primitive that didn't exist before.
- **Status:** This is actually v1, not v1.1. Listed here for tracking.

### `?dateOverride=YYYY-MM-DD` dev-only escape hatch
- **What:** Query param that forces a specific date for testing. Only active in non-production builds.
- **Why:** Testing "next-day streak" or "first-time user" flows is otherwise painful (have to mock system time).
- **Pros:** E2E tests run cleanly. Manual QA is fast.
- **Cons:** Tiny risk of leaking into prod build if guard misses. Easy to mitigate with a build-time env check.
- **Status:** Should land with v1 if Playwright tests need it.

---

## v2 (validate the loop first)

### Voice mode
- **What:** Web Speech API for both reading problems aloud and accepting spoken answers.
- **Why:** This was the user's #1 stated frustration with the GMAT prep app: *"its not voice enabled."* Hands-free practice during commute or cooking is a unique angle nothing in the mental math space currently has.
- **Pros:** Genuine differentiation. Lets the app reach users in moments where screen-tapping isn't possible. Becomes the headline v2 feature.
- **Cons:** Speech recognition for spoken numbers is finicky ("seventeen hundred" vs "1,700" vs "1700"). Web Speech API support varies (Chrome solid, Safari limited). Requires careful UX for failure modes.
- **Depends on:** v1 loop validation. Don't build voice on a foundation that hasn't proven it has retention.

### Adaptive difficulty engine
- **What:** Track per-user solve times and accuracy by problem category. Weight upcoming problems toward categories the user is slow on.
- **Why:** GMAT app failure: *"I had to keep choosing topics I am weak at."* Auto-adapting is the headline diff vs every other math drill.
- **Pros:** Real personalization. Bigger moat. Stops the drift toward "this app is repetitive."
- **Cons:** Requires user accounts (or at least durable per-user state across sessions, which PWA + localStorage gets us partway). Requires per-problem instrumentation. ~1-2 weekends of work.
- **Depends on:** PostHog tracking + accounts (or PWA-stable localStorage), then engine.

### Per-user speed-over-time graph
- **What:** A "your progress" page showing avg solve time and accuracy per category over weeks/months.
- **Why:** The "look how much faster I got" payoff. Only works once we have per-user history.
- **Pros:** Strong retention hook. Concrete proof of improvement. Shareable.
- **Cons:** Requires accounts + DB or at minimum local persistent history. ~1 weekend.
- **Depends on:** Accounts or PWA-stable storage + tracking.

### Streak export / import
- **What:** Settings option to download a JSON of your streak + history, and import it on a new device.
- **Why:** Bridges the no-account world. User switches phones, doesn't lose 200-day streak.
- **Pros:** Cross-device continuity without building auth.
- **Cons:** Manual UX (open file, paste blob). Most users won't bother.
- **Depends on:** Nothing technical. Just a small UI add.

### Cipher / curiosity unlock (Approach C from office hours)
- **What:** Daily puzzle's answers spell out a code or unlock a math curiosity (a fact, an unsolved problem, an anecdote).
- **Why:** Layered "whoa": speed + a thing you didn't know. Builder mode's recommendation if loop validates.
- **Pros:** Distinctive. Two reasons to come back per day, not one.
- **Cons:** Cleverness might not click for casual users. Smaller mass appeal than the basic loop.
- **Depends on:** v1 loop validating. Don't layer cleverness onto an unproven foundation.

---

## v3+ (only if there's traction)

- **Native mobile apps** (iOS/Android via React Native or Capacitor)
- **Leaderboards / friend comparison** (requires accounts + backend)
- **Multi-language / i18n** (problem bank translation)
- **Custom problem packs** (user-authored, shareable)
- **Team mode** (your team plays the daily together, see each other's times)
- **Premium tier** (advanced analytics, custom drill modes, ad-free if we ever add ads)
