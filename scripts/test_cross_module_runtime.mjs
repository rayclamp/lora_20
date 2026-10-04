import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const ROOT = process.cwd();
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const exists = (p) => fs.existsSync(path.join(ROOT, p));

const sharedRuntime = "00_MASTER/PRODUCTION_WORKER_RUNTIME.md";
const dispatch = "00_MASTER/PRODUCTION_DISPATCH_PROTOCOL.md";
const output = "00_MASTER/PRODUCTION_OUTPUT_PROTOCOL.md";
const registry = read("00_MASTER/MODULE_REGISTRY.md");
const authority = read("00_MASTER/AUTHORITY_MATRIX.md");
const architecture = read("00_MASTER/SYSTEM_ARCHITECTURE.md");

assert.ok(exists(sharedRuntime), "shared Worker Runtime missing");
assert.ok(exists(dispatch), "shared Dispatch protocol missing");
assert.ok(exists(output), "shared Output protocol missing");
assert.ok(architecture.includes("CORE → DISPATCH → SHARED WORKER RUNTIME → PRODUCTION MODULE"), "shared production-core boundary missing");

const modules = [
  {
    id: "UNIVERSAL_WALLPAPER",
    status: "ACTIVE",
    profile: "00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md",
    state: "MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/",
    forbidden: ["LORA_PRODUCTION/BATCHES", "FESTIVAL_COSTUME_DATABASE"]
  },
  {
    id: "FESTIVAL_WALLPAPER",
    status: "ACTIVE",
    profile: "00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md",
    state: null,
    forbidden: ["LORA_PRODUCTION/BATCHES", "UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES"]
  },
  {
    id: "LORA_PRODUCTION",
    status: "PAUSED",
    profile: "MODULES/LORA_PRODUCTION/MODULE.md",
    adapter: "MODULES/LORA_PRODUCTION/PRODUCTION/WORKER_PROTOCOL.md",
    state: "MODULES/LORA_PRODUCTION/BATCHES/",
    forbidden: ["UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES", "FESTIVAL_COSTUME_DATABASE"]
  }
];

for (const m of modules) {
  assert.ok(exists(m.profile), `${m.id}: profile missing`);
  const profile = read(m.profile);
  assert.ok(profile.includes(sharedRuntime), `${m.id}: does not route to shared Worker Runtime`);
  assert.ok(!profile.includes("independent Worker") && !profile.includes("second Worker"), `${m.id}: declares an independent Worker system`);
  assert.ok(!profile.includes("second Dispatch") && !profile.includes("independent Dispatch"), `${m.id}: declares an independent Dispatch system`);
  if (m.state) {
    assert.ok(exists(m.state), `${m.id}: canonical state path missing`);
  }
  for (const forbidden of m.forbidden) {
    assert.ok(!profile.includes(forbidden), `${m.id}: profile imports forbidden cross-module state/data: ${forbidden}`);
  }
  assert.ok(profile.includes("MODULE"), `${m.id}: profile does not identify module ownership`);
  console.log(`PASS module isolation: ${m.id}`);
}

const loraAdapter = read("MODULES/LORA_PRODUCTION/PRODUCTION/WORKER_PROTOCOL.md");
assert.ok(loraAdapter.includes("LoRA-specific Worker adapter"), "LoRA adapter boundary missing");
assert.ok(loraAdapter.includes("shared Output/Persistence"), "LoRA output boundary missing");

const festival = read("00_MASTER/WALLPAPER/FESTIVAL_WALLPAPER_MANUAL_DESIGN_PROMPT.md");
assert.ok(festival.includes("not an independent Worker or Dispatch system"), "Festival boundary missing");

const universal = read("00_MASTER/UNIVERSAL_WALLPAPER_WORKER_PROTOCOL.md");
assert.ok(universal.includes("production module"), "Universal module boundary missing");
assert.ok(universal.includes("shared runtime"), "Universal shared runtime routing missing");

assert.ok(registry.includes("FESTIVAL_WALLPAPER | ACTIVE"), "Festival status mismatch");
assert.ok(registry.includes("LORA_PRODUCTION | PAUSED"), "LoRA status mismatch");
assert.ok(authority.includes("Production Dispatch"), "Dispatch authority missing");
assert.ok(authority.includes("Shared Production Worker Runtime"), "Worker Runtime authority missing");

const sharedOwners = [sharedRuntime, dispatch, output];
for (const p of sharedOwners) {
  const c = read(p);
  assert.ok(!c.includes("MODULES/LORA_PRODUCTION/BATCHES/") || p === output, `${p}: shared core illegally owns LoRA state`);
  assert.ok(!c.includes("MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/") || p === output, `${p}: shared core illegally owns Universal state`);
}

console.log("PASS shared Worker Runtime routing");
console.log("PASS module state isolation");
console.log("PASS Dispatch boundary");
console.log("PASS Output boundary");
console.log("PASS paused-module non-activation boundary");
console.log("CROSS-MODULE RUNTIME VERIFICATION: PASS");
