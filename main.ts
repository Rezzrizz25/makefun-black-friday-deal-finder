// Bargain Beacon — Black Friday deal finder entry (Node 22, stdlib only).
//
// The site itself is plain static files under app/ (index.html, style.css,
// and the deal data plus filter/render/main modules). Nothing it runs,
// styles or shows loads over the network, and each deal links out to its
// store. This program hands the entry in: it copies app/ and screenshots/
// from beside this file into /output (or MAKEFUN_OUTPUT_DIR outside the
// grader) and writes /output/dossier.json with the vendored make.fun
// library, which is the summary the judge reads — the screenshots, the
// first load's files and bytes, and the site's source.
//
// Leave vendor/makefun-frontend.ts untouched: the scorer rebuilds the
// dossier with its own copy and requires a byte-for-byte match.
//
// Run it locally:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, "app"), join(outputDir, "app"), { recursive: true });
mkdirSync(join(outputDir, "screenshots"), { recursive: true });
if (existsSync(join(repoRoot, "screenshots"))) {
  cpSync(join(repoRoot, "screenshots"), join(outputDir, "screenshots"), {
    recursive: true,
  });
}

// The scorer's own caps: at most 4 screenshots, each at most 256 KiB; at
// most 993 files and directories in app/ and 16 MiB of app files. The
// dossier text is capped at 160 KiB, so the judge's outline stays readable.
writeFileSync(
  join(outputDir, "dossier.json"),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
