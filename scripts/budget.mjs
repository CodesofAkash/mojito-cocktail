#!/usr/bin/env node
/**
 * Performance budget gate.
 *
 * Run in CI after `next build`. A regression fails the build, which is the
 * point: without enforcement, page weight creeps back within a month.
 *
 * Baseline for comparison: .claude-local/perf-baseline.md
 */
import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const BUDGETS = {
  publicTotalMB: 3.5,
  singleAssetMB: 1.5,
  firstLoadJsKB: 300,
};

const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
      )
    : [];

const mb = (b) => b / 1048576;
const failures = [];

const publicFiles = walk("public");
const publicTotal = mb(publicFiles.reduce((t, f) => t + statSync(f).size, 0));
if (publicTotal > BUDGETS.publicTotalMB) {
  failures.push(`public/ is ${publicTotal.toFixed(2)} MB, budget ${BUDGETS.publicTotalMB} MB`);
}

for (const file of publicFiles) {
  const size = mb(statSync(file).size);
  if (size > BUDGETS.singleAssetMB) {
    failures.push(`${file} is ${size.toFixed(2)} MB, budget ${BUDGETS.singleAssetMB} MB per asset`);
  }
}

console.log(`public/ total: ${publicTotal.toFixed(2)} MB (budget ${BUDGETS.publicTotalMB} MB)`);
console.log(`largest assets:`);
publicFiles
  .map((f) => [f, statSync(f).size])
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .forEach(([f, s]) => console.log(`  ${mb(s).toFixed(2)} MB  ${f}`));

if (failures.length) {
  console.error("\nBUDGET EXCEEDED:");
  failures.forEach((f) => console.error("  - " + f));
  process.exit(1);
}
console.log("\nWithin budget.");
