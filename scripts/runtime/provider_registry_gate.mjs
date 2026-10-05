#!/usr/bin/env node

export const PROVIDER_REQUIRED_FIELDS = [
  "PROVIDER_ID",
  "PROVIDER_NAME",
  "ADAPTER_MODULE",
  "STATUS",
  "TRANSPORT_TYPE",
  "AUTHORITY_SOURCE",
  "CREDENTIAL_SOURCE",
  "SUPPORTED_OUTPUT_TYPES",
  "RESULT_VERIFICATION_POLICY",
  "IDEMPOTENCY_SUPPORT",
  "REGISTRATION_VERSION"
];

export const PRODUCTION_PROVIDER_STATUS = "VERIFIED";

export function assertProductionProviderEligible(registration) {
  if (!registration || typeof registration !== "object") {
    throw new Error("PROVIDER_REGISTRATION_REQUIRED");
  }
  for (const field of PROVIDER_REQUIRED_FIELDS) {
    const value = registration[field];
    if (value === undefined || value === null || value === "") {
      throw new Error(`PROVIDER_REGISTRATION_INCOMPLETE:${field}`);
    }
  }
  if (registration.STATUS !== PRODUCTION_PROVIDER_STATUS) {
    throw new Error("PROVIDER_NOT_PRODUCTION_ELIGIBLE");
  }
  if (!Array.isArray(registration.SUPPORTED_OUTPUT_TYPES) || registration.SUPPORTED_OUTPUT_TYPES.length === 0) {
    throw new Error("PROVIDER_OUTPUT_TYPES_REQUIRED");
  }
  if (registration.IDEMPOTENCY_SUPPORT !== "REQUIRED_KEY") {
    throw new Error("PROVIDER_IDEMPOTENCY_SUPPORT_REQUIRED");
  }
  return true;
}
