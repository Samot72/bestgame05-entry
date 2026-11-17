// The Last Firefly — the best-game-01 entry that hands the game in (Node 22,
// standard library only). The game itself is the plain static site in game/
// beside this file: a single game/index.html, no library, no build step,
// nothing fetched. This program copies game/ and screenshots/ into the
// output directory and writes dossier.json there with the vendored make.fun
// library, exactly as the kit's starter does, so the scorer rebuilds the
// same bytes and compares them.
//
// Play it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoDir = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(repoDir, 'game'), join(outDir, 'game'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoDir, 'screenshots'))) {
  cpSync(join(repoDir, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The caps are the scorer's own (reference/gate.json). Only text_max_bytes shapes
// the dossier's bytes; the rest restate limits the scorer enforces anyway, so an
// entry that would be refused there is refused here first, with the same numbers.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
