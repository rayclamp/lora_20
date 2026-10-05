#!/usr/bin/env node

import assert from "node:assert/strict";
import { assertProductionProviderEligible } from "./runtime/provider_registry_gate.mjs";

const base = {
  PROVIDER_ID: "TEST_PROVIDER",
  PROVIDER_NAME: "Deterministic Test Provider",
  ADAPTER_MODULE: "scripts/runtime/image_provider_adapter.mjs",
  STATUS: "VERIFIED",
  TRANSPORT_TYPE: "TEST_DOUBLE",
  AUTHORITY_SOURCE: "PHASE12_TEST",
  CREDENTIAL_SOURCE: "NOT_REQUIRED",
  SUPPORTED_OUTPUT_TYPES: ["DESKTOP_WALLPAPER"],
  RESULT_VERIFICATION_POLICY: "TEST_VERIFIED",
  IDEMPOTENCY_SUPPORT: "REQUIRED_KEY",
  REGISTRATION_VERSION: "1"
};

assert.equal(assertProductionProviderEligible(base), true);

for (const status of ["UNREGISTERED", "REGISTERED", "AUTHORIZED", "BLOCKED"]) {
  assert.throws(
    () => assertProductionProviderEligible({ ...base, STATUS: status }),
    /PROVIDER_NOT_PRODUCTION_ELIGIBLE/
  );
}

assert.throws(
  () => assertProductionProviderEligible({ ...base, PROVIDER_ID: "" }),
  /PROVIDER_REGISTRATION_INCOMPLETE:PROVIDER_ID/
);

assert.throws(
  () => assertProductionProviderEligible({ ...base, SUPPORTED_OUTPUT_TYPES: [] }),
  /PROVIDER_OUTPUT_TYPES_REQUIRED/
);

assert.throws(
  () => assertProductionProviderEligible({ ...base, IDEMPOTENCY_SUPPORT: "NONE" }),
  /PROVIDER_IDEMPOTENCY_SUPPORT_REQUIRED/
);

console.log("Runtime Verification Phase-12 provider activation gate: PASS");
console.log("PASS only VERIFIED provider registrations are production-eligible");
console.log("PASS incomplete registration is fail-closed");
console.log("PASS unsupported output registry is fail-closed");
