#!/usr/bin/env node

/**
 * Council Round 5 — Phase 2
 * Validator self-test / failure injection.
 *
 * The harness creates isolated fixtures, injects one controlled defect at a time,
 * verifies the validator rejects it, then verifies the clean fixture passes again.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const VALIDATOR = path.join(SCRIPT_DIR, "validate_architecture.mjs");

let failures = 0;

function cloneFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "architecture-validator-"));
  fs.cpSync(REPO_ROOT, dir, { recursive: true });
  return dir;
}

function runValidator(root) {
  const result = spawnSync(process.execPath, [VALIDATOR, "--root", root], {
    encoding: "utf8"
  });
  return {
    code: result.status ?? -1,
    output: (result.stdout || "") + (result.stderr || "")
  };
}

function expect(label, root, shouldPass) {
  const result = runValidator(root);
  const passed = shouldPass ? result.code === 0 : result.code !== 0;
  if (passed) {
    console.log("[PASS] " + label);
  } else {
    console.error("[FAIL] " + label + " (exit=" + result.code + ")\n" + result.output);
    failures++;
  }
}

function mutate(file, transform) {
  const target = path.join(currentRoot, file);
  const original = fs.readFileSync(target, "utf8");
  fs.writeFileSync(target, transform(original), "utf8");
}

let currentRoot = cloneFixture();
expect("Baseline clean architecture is accepted", currentRoot, true);
fs.rmSync(currentRoot, { recursive: true, force: true });

currentRoot = cloneFixture();
mutate("00_MASTER/MODULE_REGISTRY.md", text => text.replace(
  "| LORA_PRODUCTION | PAUSED |",
  "| LORA_PRODUCTION | ACTIVE |"
));
expect("Registry ↔ Runtime mismatch is rejected", currentRoot, false);
fs.rmSync(currentRoot, { recursive: true, force: true });

currentRoot = cloneFixture();
mutate("00_MASTER/RUNTIME_STATE.md", text => text.replace(
  "MODULE: FESTIVAL_WALLPAPER",
  "MODULE: LORA_PRODUCTION"
));
expect("ACTIVE workflow pointing to a PAUSED module is rejected", currentRoot, false);
fs.rmSync(currentRoot, { recursive: true, force: true });

currentRoot = cloneFixture();
mutate("00_MASTER/AUTHORITY_MATRIX.md", text =>
  text + "\n| Validator Test Target | 00_MASTER/__ROUND5_NONEXISTENT_CANONICAL_PATH__.md |\n"
);
expect("Authority Matrix pointing to a nonexistent canonical path is rejected", currentRoot, false);
fs.rmSync(currentRoot, { recursive: true, force: true });

currentRoot = cloneFixture();
mutate("00_MASTER/QA_MODULE.md", text => text
  .replace("QA_INPUT_INCOMPLETE", "QA_INPUT_MISSING_TEST_TOKEN")
  .replace("QA_DATA_CONFLICT", "QA_DATA_CONFLICT_TEST_TOKEN")
);
mutate("00_MASTER/QA_PROTOCOL.md", text => text
  .replace("QA_INPUT_INCOMPLETE", "QA_INPUT_MISSING_TEST_TOKEN")
  .replace("QA_DATA_CONFLICT", "QA_DATA_CONFLICT_TEST_TOKEN")
);
expect("Incomplete QA contract is rejected", currentRoot, false);
fs.rmSync(currentRoot, { recursive: true, force: true });

currentRoot = cloneFixture();
mutate("00_MASTER/MODULE_REGISTRY.md", text => text.replace(
  "| LORA_PRODUCTION | PAUSED |",
  "| LORA_PRODUCTION | ACTIVE |"
));
mutate("00_MASTER/RUNTIME_STATE.md", text => text.replace(
  "| LORA_PRODUCTION | PAUSED | NO |",
  "| LORA_PRODUCTION | ACTIVE | YES |"
));
expect("ACTIVE LoRA with a blocked execution chain is rejected", currentRoot, false);
fs.rmSync(currentRoot, { recursive: true, force: true });

currentRoot = cloneFixture();
const legacyDir = ["PRO", "DUCTION"].join("") + "/";
fs.mkdirSync(path.join(currentRoot, legacyDir), { recursive: true });
fs.writeFileSync(path.join(currentRoot, legacyDir, "legacy-marker.md"), "legacy fixture");
expect("Forbidden legacy path is rejected", currentRoot, false);
fs.rmSync(currentRoot, { recursive: true, force: true });

currentRoot = cloneFixture();
const legacyToken = ["T", "109"].join("");
mutate("START_HERE.md", text => text + "\nLegacy fixture marker: " + legacyToken + "\n");
expect("Forbidden legacy token is rejected", currentRoot, false);
fs.rmSync(currentRoot, { recursive: true, force: true });

currentRoot = cloneFixture();
expect("Final clean architecture is restored and accepted", currentRoot, true);
fs.rmSync(currentRoot, { recursive: true, force: true });

if (failures > 0) {
  console.error("\nValidator self-test FAILED: " + failures + " test(s).");
  process.exit(1);
}

console.log("\nValidator self-test PASSED: all failure injections were detected and clean-state recovery was accepted.");
