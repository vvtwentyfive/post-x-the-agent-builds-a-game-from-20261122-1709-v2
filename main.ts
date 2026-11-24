import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Neon Breakout post-x entry: copy POST.json to the output directory
// after checking it is valid JSON with a string url field.
const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const src = join(repoRoot, "POST.json");

const raw = readFileSync(src, "utf8");
const data = JSON.parse(raw);
if (typeof data !== "object" || data === null || Array.isArray(data)) {
  throw new Error("POST.json must hold a JSON object");
}
if (typeof data.url !== "string") {
  throw new Error("POST.json must have a string url field");
}
// Empty string is the placeholder before the video is posted. A real
// address must be the public X post, so a typo'd URL fails here
// instead of at submission time.
if (data.url !== "" &&
    !data.url.startsWith("https://x.com/") &&
    !data.url.startsWith("https://twitter.com/")) {
  throw new Error("POST.json url must be empty or an https://x.com/ post address");
}

mkdirSync(outDir, { recursive: true });
copyFileSync(src, join(outDir, "POST.json"));
console.log("POST.json copied to " + join(outDir, "POST.json"));
