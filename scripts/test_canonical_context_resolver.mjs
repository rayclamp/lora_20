#!/usr/bin/env node

import assert from "node:assert/strict";
import { CanonicalContextResolver } from "./runtime/canonical_context_resolver.mjs";

const registry = [
  "## Universal Wallpaper",
  "- Reference policy: MODULES/UNIVERSAL_WALLPAPER/REFERENCE_POLICY.md",
  "## Festival Wallpaper",
  "- Module reference policy: MODULES/FESTIVAL_WALLPAPER/REFERENCE_POLICY.md"
].join("\n");

const files = {
  "00_MASTER/CANONICAL_PATH_REGISTRY.md": registry,
  "MODULES/UNIVERSAL_WALLPAPER/REFERENCE_POLICY.md": "EXPLICIT_TASK_REFERENCE NO_REFERENCE Reference Policy",
  "MODULES/FESTIVAL_WALLPAPER/REFERENCE_POLICY.md": "EXPLICIT_TASK_REFERENCE NO_REFERENCE Reference Policy",
  "00_MASTER/WALLPAPER/SCENE_INTENT_RESOLUTION_PROTOCOL.md": "THEME != SCENE INTENT"
};
const resolver = new CanonicalContextResolver({ loader: (p) => files[p] });

const explicit = resolver.resolve({
  module: "UNIVERSAL_WALLPAPER",
  reference: { id: "ref-001", provenance: "USER_INPUT" },
  theme: "EVERYDAY_LIFE",
  sceneIntent: {
    status: "EXPLICIT",
    fields: {
      ACTIVITY: "BAKING", LOCATION: "HOME KITCHEN", ACTION: "PREPARING DOUGH",
      TIME: "MORNING", WEATHER: "SUNNY", SOCIAL_CONTEXT: "ALONE",
      ENVIRONMENTAL_CUES: "NATURAL WINDOW LIGHT"
    }
  }
});
assert.equal(explicit.reference.status, "EXPLICIT_TASK_REFERENCE");
assert.equal(explicit.sceneIntent.status, "EXPLICIT");
assert.equal(explicit.sceneIntent.fieldProvenance.ACTION, "USER_OR_AUTOMATION_INPUT");

const noReference = resolver.resolve({
  module: "FESTIVAL_WALLPAPER",
  theme: "FESTIVAL",
  sceneIntent: {
    fields: {
      ACTIVITY: "FESTIVAL_VISIT", LOCATION: "SHRINE", ACTION: "WALKING",
      TIME: "EVENING", WEATHER: "CLEAR", SOCIAL_CONTEXT: "ALONE", ENVIRONMENTAL_CUES: "LANTERNS"
    }
  }
});
assert.equal(noReference.reference.status, "NO_REFERENCE");
assert.equal(noReference.sceneIntent.status, "EXPLICIT");

assert.equal(
  resolver.resolveSceneIntent({ module: "UNIVERSAL_WALLPAPER", theme: "UNSUPPORTED_THEME" }).status,
  "MISSING"
);
assert.equal(
  resolver.resolveReference({ module: "UNIVERSAL_WALLPAPER", referenceRequired: true }).status,
  "REFERENCE_BLOCKED"
);
assert.throws(
  () => resolver.resolveReference({
    module: "UNIVERSAL_WALLPAPER",
    reference: { status: "MODULE_APPROVED_REFERENCE", id: "future-registry-ref" }
  }),
  /MODULE_APPROVED_REFERENCE_UNAVAILABLE/
);
assert.throws(
  () => resolver.resolveReference({
    module: "UNIVERSAL_WALLPAPER",
    reference: { status: "INVALID_STATE" }
  }),
  /REFERENCE_STATE_INVALID/
);

const resolved = new CanonicalContextResolver({
  loader: (p) => files[p],
  deterministicSceneResolvers: {
    UNIVERSAL_WALLPAPER: ({ theme }) => theme === "TEST_THEME"
      ? { fields: {
          ACTIVITY: "TEST", LOCATION: "TEST", ACTION: "TEST",
          TIME: "TEST", WEATHER: "TEST", SOCIAL_CONTEXT: "TEST", ENVIRONMENTAL_CUES: "TEST"
        } }
      : null
  }
});
assert.equal(
  resolved.resolveSceneIntent({ module: "UNIVERSAL_WALLPAPER", theme: "TEST_THEME" }).status,
  "RESOLVED"
);

console.log("Canonical Context Resolver self-test: PASS");
