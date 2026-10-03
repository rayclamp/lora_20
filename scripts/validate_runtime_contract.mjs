#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const required=[
"00_MASTER/RUNTIME_STATE_MACHINE_SPEC.md",
"00_MASTER/RUNTIME_TASK_SCHEMA.md",
"00_MASTER/CLAIM_LEASE_CAS_SPEC.md",
"00_MASTER/WORKER_RUNTIME_SPEC.md",
"00_MASTER/GENERATION_ADAPTER_SPEC.md",
"00_MASTER/RESULT_EVENT_PERSISTENCE_SPEC.md",
"00_MASTER/UNKNOWN_RECOVERY_SPEC.md",
"00_MASTER/RETRY_CIRCUIT_BREAKER_SPEC.md",
"00_MASTER/OPERATIONAL_SMOKE_TEST_SPEC.md",
"scripts/runtime_engine.mjs",
"scripts/test_runtime_engine.mjs"
];
let fail=0;
for(const f of required){
 if(!fs.existsSync(path.join(ROOT,f))){console.error("[FAIL] missing "+f);fail++;}
}
const read=f=>fs.readFileSync(path.join(ROOT,f),"utf8");
const checks=[
["state transitions",["QUEUED → CLAIMED → GENERATING → IMAGE_CREATED","GENERATING → UNKNOWN → RECOVERY_REQUIRED"]],
["task schema",["TASK_ID","MODULE_ID","STATE_VERSION","IDEMPOTENCY_KEY"]],
["claim lease cas",["CLAIM_ID","LEASE_EXPIRES_AT","CAS","stale write"]],
["worker",["CLAIM","GENERATE","RECORD RESULT","do not"]],
["adapter",["SUCCESS","FAILED","UNKNOWN","OUTPUT_COUNT_MISMATCH"]],
["events",["EVENT_ID","append-only","STATE_VERSION_BEFORE"]],
["recovery",["UNKNOWN","RECOVERED_SUCCESS","RETRY_AUTHORIZED"]],
["retry",["3 genuine generation-tool attempts","OPEN","SAFETY_BLOCKED"]]
];
for(const [label,tokens] of checks){
 const joined=required.filter(f=>f.startsWith("00_MASTER/")).map(read).join("\n");
 for(const token of tokens) if(!joined.includes(token)){console.error("[FAIL] "+label+" missing "+token);fail++;}
}
if(!read("scripts/runtime_engine.mjs").includes("casUpdate")){console.error("[FAIL] runtime engine missing CAS update");fail++;}
if(!read("scripts/runtime_engine.mjs").includes("CIRCUIT_OPEN")){console.error("[FAIL] runtime engine missing circuit guard");fail++;}
if(!read("scripts/test_runtime_engine.mjs").includes("Runtime smoke tests PASSED")){console.error("[FAIL] smoke test completion marker missing");fail++;}
if(fail){console.error("\nRuntime contract validation FAILED: "+fail+" issue(s).");process.exit(1);}
console.log("Runtime contract validation PASSED.");
