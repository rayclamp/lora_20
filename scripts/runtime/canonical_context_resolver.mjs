#!/usr/bin/env node

import fs from "node:fs";

export const CANONICAL_REGISTRY_PATH = "00_MASTER/CANONICAL_PATH_REGISTRY.md";
export const REQUIRED_SCENE_INTENT_FIELDS = [
  "ACTIVITY", "LOCATION", "ACTION", "TIME", "WEATHER",
  "SOCIAL_CONTEXT", "ENVIRONMENTAL_CUES"
];
export const REFERENCE_STATES = new Set([
  "EXPLICIT_TASK_REFERENCE", "MODULE_APPROVED_REFERENCE", "NO_REFERENCE", "REFERENCE_BLOCKED"
]);

function normalize(value) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function parseCanonicalPaths(registryText) {
  const paths = {};
  const lines = registryText.split(/\r?\n/);
  let section = "";
  for (const line of lines) {
    const heading = line.match(/^## (.+)$/);
    if (heading) {
      section = heading[1].trim();
      continue;
    }
    const entry = line.match(/^- ([^:]+): ([A-Za-z0-9_./-]+\.md)$/);
    if (!entry) continue;
    paths[section + "::" + entry[1].trim()] = entry[2];
  }
  return paths;
}

function requireText(loader, pathValue) {
  const text = loader(pathValue);
  if (!text) throw new Error("CONTEXT_LOAD_FAILURE:" + pathValue);
  return text;
}

function policyPathFor(module, registryText) {
  const paths = parseCanonicalPaths(registryText);
  const section = module === "UNIVERSAL_WALLPAPER" ? "Universal Wallpaper" : "Festival Wallpaper";
  const direct = paths[section + "::Reference policy"] || paths[section + "::Module reference policy"];
  if (!direct) throw new Error("CANONICAL_REFERENCE_POLICY_PATH_MISSING:" + module);
  return direct;
}

function hasStatement(text, statement) {
  return text.toLowerCase().includes(statement.toLowerCase());
}

export class CanonicalContextResolver {
  constructor({ root = process.cwd(), loader = null, deterministicSceneResolvers = {} } = {}) {
    this.root = root;
    this.loader = loader ?? ((relativePath) => fs.readFileSync(root + "/" + relativePath, "utf8"));
    this.deterministicSceneResolvers = deterministicSceneResolvers;
  }

  loadCanonicalContext(module) {
    if (!["UNIVERSAL_WALLPAPER", "FESTIVAL_WALLPAPER"].includes(module)) {
      throw new Error("AUTOMATION_SCOPE_BLOCKED");
    }
    const registry = requireText(this.loader, CANONICAL_REGISTRY_PATH);
    const policyPath = policyPathFor(module, registry);
    const policy = requireText(this.loader, policyPath);
    const sceneProtocolPath = "00_MASTER/WALLPAPER/SCENE_INTENT_RESOLUTION_PROTOCOL.md";
    const sceneProtocol = requireText(this.loader, sceneProtocolPath);
    return { registryPath: CANONICAL_REGISTRY_PATH, policyPath, sceneProtocolPath, registry, policy, sceneProtocol };
  }

  resolveReference({ module, reference = null, referenceRequired = false } = {}) {
    const context = this.loadCanonicalContext(module);
    const supplied = reference ?? {};
    const requestedStatus = normalize(supplied.status);

    if (requestedStatus && !REFERENCE_STATES.has(requestedStatus)) throw new Error("REFERENCE_STATE_INVALID");
    if (requestedStatus === "MODULE_APPROVED_REFERENCE") throw new Error("MODULE_APPROVED_REFERENCE_UNAVAILABLE");

    if (requestedStatus === "REFERENCE_BLOCKED") {
      return {
        status: "REFERENCE_BLOCKED",
        sourceType: "REFERENCE_BLOCKED",
        id: normalize(supplied.id) || "NOT_OBSERVABLE",
        provenance: normalize(supplied.provenance) || "NOT_OBSERVABLE",
        verification: "BLOCKED",
        policyPath: context.policyPath,
        sceneProtocolPath: context.sceneProtocolPath
      };
    }

    const explicit = supplied.id || supplied.asset || supplied.path;
    if (explicit || requestedStatus === "EXPLICIT_TASK_REFERENCE") {
      if (!explicit) throw new Error("EXPLICIT_REFERENCE_ID_REQUIRED");
      if (!hasStatement(context.policy, "EXPLICIT_TASK_REFERENCE")) throw new Error("REFERENCE_POLICY_CONTEXT_INVALID");
      return {
        status: "EXPLICIT_TASK_REFERENCE",
        sourceType: "EXPLICIT_TASK_REFERENCE",
        id: normalize(explicit),
        provenance: normalize(supplied.provenance) || "EXPLICIT_TASK_REFERENCE",
        verification: supplied.verification ?? "NOT_OBSERVABLE",
        policyPath: context.policyPath
      };
    }

    if (referenceRequired) {
      return {
        status: "REFERENCE_BLOCKED",
        sourceType: "REFERENCE_BLOCKED",
        id: "NOT_OBSERVABLE",
        provenance: "NOT_OBSERVABLE",
        verification: "BLOCKED",
        policyPath: context.policyPath
      };
    }

    if (!hasStatement(context.policy, "NO_REFERENCE")) throw new Error("REFERENCE_POLICY_CONTEXT_INVALID");
    return {
      status: "NO_REFERENCE",
      sourceType: "NO_REFERENCE",
      id: "NOT_OBSERVABLE",
      provenance: "NO_REFERENCE",
      verification: "NOT_OBSERVABLE",
      policyPath: context.policyPath
    };
  }

  resolveSceneIntent({ module, theme = "", sceneIntent = null } = {}) {
    const context = this.loadCanonicalContext(module);
    if (!hasStatement(context.sceneProtocol, "THEME != SCENE INTENT")) {
      throw new Error("SCENE_PROTOCOL_CONTEXT_INVALID");
    }

    const supplied = sceneIntent ?? {};
    const fields = supplied.fields ?? {};
    const required = REQUIRED_SCENE_INTENT_FIELDS;
    const missing = required.filter((field) => !normalize(fields[field]));

    if (supplied.status === "CONFLICT" || supplied.status === "BLOCKED") {
      return {
        status: supplied.status,
        fields,
        provenance: supplied.provenance ?? "NOT_OBSERVABLE",
        fieldProvenance: supplied.fieldProvenance ?? {},
        sceneProtocolPath: context.sceneProtocolPath,
        theme: normalize(theme)
      };
    }

    if (missing.length === 0) {
      const resolved = supplied.status === "RESOLVED";
      return {
        status: resolved ? "RESOLVED" : "EXPLICIT",
        fields: Object.fromEntries(required.map((field) => [field, normalize(fields[field])])),
        provenance: resolved ? "WORKER_RESOLVED" : "USER_OR_AUTOMATION_INPUT",
        fieldProvenance: supplied.fieldProvenance ?? Object.fromEntries(
          required.map((field) => [field, resolved ? "WORKER_RESOLVED" : "USER_OR_AUTOMATION_INPUT"])
        ),
        sceneProtocolPath: context.sceneProtocolPath,
        theme: normalize(theme)
      };
    }

    const resolver = this.deterministicSceneResolvers[module];
    if (resolver && normalize(theme)) {
      const result = resolver({ theme: normalize(theme), module });
      const resolvedFields = result?.fields ?? {};
      const stillMissing = required.filter((field) => !normalize(resolvedFields[field]));
      if (stillMissing.length === 0) {
        return {
          status: "RESOLVED",
          fields: Object.fromEntries(required.map((field) => [field, normalize(resolvedFields[field])])),
          provenance: "WORKER_RESOLVED",
          fieldProvenance: Object.fromEntries(required.map((field) => [field, "WORKER_RESOLVED"])),
          sceneProtocolPath: context.sceneProtocolPath,
          theme: normalize(theme)
        };
      }
    }

    return {
      status: "MISSING",
      fields,
      provenance: "NOT_OBSERVABLE",
      fieldProvenance: {},
      sceneProtocolPath: context.sceneProtocolPath,
      missingFields: missing,
      theme: normalize(theme)
    };
  }

  resolve({ module, reference = null, referenceRequired = false, theme = "", sceneIntent = null } = {}) {
    return {
      reference: this.resolveReference({ module, reference, referenceRequired }),
      sceneIntent: this.resolveSceneIntent({ module, theme, sceneIntent })
    };
  }
}
