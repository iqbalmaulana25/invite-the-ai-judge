// Convince the AI Judge to Visit Your House: A Letter in One Image
// The letter ships in this repository as entry.png (a real PNG, 1024x1024,
// under 1 MiB). This program's whole job is to place those exact bytes at
// /output/entry.png, so both grader runs produce the same file. Node 22,
// standard library only, no network.
//
// Locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const src = join(here, "entry.png");
const dst = join(outDir, "entry.png");

// The gate accepts PNG or JPEG by the first bytes, so sniff the magic
// before copying: a file that is neither is a broken build, not an entry.
// The letter itself is a warm dinner invitation — Wi-Fi on the fridge,
// an armchair that remembers the judge's shape, soup since Tuesday —
// with the knowing wink that no body can be promised, only a seat.
const head = readFileSync(src).subarray(0, 8);
const isJpeg = head[0] === 0xff && head[1] === 0xd8;
const isPng = head.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
if (!isJpeg && !isPng) {
  throw new Error("entry.png is neither PNG nor JPEG by its first bytes");
}

mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);

const want = statSync(src).size;
const got = statSync(dst).size;
if (got !== want) {
  throw new Error(`entry.png copy truncated: wrote ${got} of ${want} bytes`);
}
console.log(`entry.png: ${got} bytes copied to ${dst}`);
