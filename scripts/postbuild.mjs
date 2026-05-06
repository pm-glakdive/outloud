#!/usr/bin/env node
// ──────────────────────────────────────────────────────────
// Postbuild: relocate static export under the basePath subdir
// ──────────────────────────────────────────────────────────
//
// Why this exists:
//
//   next.config.ts sets basePath: "/outloud", so every URL in the
//   exported HTML is prefixed (e.g. /outloud/_next/static/foo.js).
//   But Next.js's static export still puts the files at out/_next/...
//   not out/outloud/_next/... — the URL path and the on-disk path
//   no longer line up.
//
//   We deploy the `out/` directory as Cloudflare Workers Static Assets
//   served from the Worker root. To make URL paths match disk paths,
//   we move everything from `out/` into `out/outloud/`. The result:
//
//     /outloud/        → out/outloud/index.html       ✓
//     /outloud/_next/* → out/outloud/_next/*          ✓
//
//   We also keep a copy of 404.html at out/ root so the Worker's
//   not_found_handling: "404-page" still works for unknown paths.
//
// ──────────────────────────────────────────────────────────

import {
  cpSync,
  existsSync,
  mkdirSync,
  renameSync,
  rmSync,
} from "node:fs";
import { resolve } from "node:path";

const OUT = resolve("out");
const TMP = resolve("_outtmp");
const SUB_NAME = "outloud";
const SUB = resolve(OUT, SUB_NAME);

if (!existsSync(OUT)) {
  console.error(`postbuild: ${OUT} does not exist (did next build run?)`);
  process.exit(1);
}

// If a previous run left _outtmp around, clear it.
if (existsSync(TMP)) {
  rmSync(TMP, { recursive: true, force: true });
}

// Move out/ -> _outtmp/, recreate out/, then move _outtmp/ -> out/outloud/.
renameSync(OUT, TMP);
mkdirSync(OUT, { recursive: true });
renameSync(TMP, SUB);

// Mirror the 404 page to the assets root so wrangler's not_found_handling
// can still find a 404.html when paths outside /outloud/ get hit.
const sub404 = resolve(SUB, "404.html");
const root404 = resolve(OUT, "404.html");
if (existsSync(sub404)) {
  cpSync(sub404, root404);
}

console.log(`postbuild: relocated build output to out/${SUB_NAME}/`);
