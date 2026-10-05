#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, ProductionWorkerRuntime, sha256 } from "./runtime/worker_runtime.mjs";

const fields={ACTIVITY:"TRAVEL",LOCATION:"CITY",ACTION:"WALKING",TIME:"DAY",WEATHER:"CLEAR",SOCIAL_CONTEXT:"ALONE",ENVIRONMENTAL_CUES:"STREET"};
function run(taskId){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"phase33-"));
 const runtime=new ProductionWorkerRuntime({store:new JsonStateStore(path.join(dir,"task.json")),workerId:"P33",visualAdherenceRequired:false,artifactPersistenceRequired:true,
  generator:{generate({prompt,outputType}){return {result:"SUCCESS",verification:"VERIFIED",output:{bytes:taskId,format:outputType,promptHash:sha256(prompt)}}}},
  outputAdapter:{persist({artifact,batchId,taskId,generationAttempt,generationIdempotencyKey,promptHash,executionContextHash}){return {result:"SUCCESS",verification:"VERIFIED",artifact:{artifactId:"A-"+taskId,uri:"storage://"+taskId,sha256:sha256(artifact.bytes),retrievalVerification:"VERIFIED",sourceTask:taskId,batchId,taskId,generationAttempt,generationIdempotencyKey,promptHash,executionContextHash}}},verify({artifact}){return {result:"VERIFIED",verification:"VERIFIED",sha256:artifact.sha256}}}});
 runtime.request({batchId:"B33",taskId,mode:"AUTOMATED",module:"UNIVERSAL_WALLPAPER",productionType:"AUTOMATED",outputType:"DESKTOP_WALLPAPER",artifactPersistenceRequired:true,visualAdherenceRequired:false});
 runtime.claim(); runtime.designAndLockPrompt("PROMPT-"+taskId,{reference:{status:"NO_REFERENCE"},sceneIntent:{status:"EXPLICIT",fields}}); runtime.authorizeAutomatedGeneration(); return {runtime,result:runtime.execute()};
}
const a=run("IMAGE-01"), b=run("IMAGE-02");
for(const x of [a.result,b.result]){
 assert.equal(x.result,"SUCCESS"); assert.equal(x.artifact.batchId,"B33"); assert.equal(x.artifact.taskId,x.taskId);
 assert.equal(x.artifact.generationAttempt,1); assert.equal(x.artifact.generationIdempotencyKey,x.generationIdempotencyKey);
 assert.equal(x.artifact.promptHash,x.promptHash); assert.equal(x.artifact.executionContextHash,x.executionContextHash);
 assert.match(x.artifact.uri,/^storage:\/\//);
}
assert.notEqual(a.result.artifact.artifactId,b.result.artifact.artifactId);
const persisted=a.runtime.requireState().artifact;
assert.deepEqual({batchId:persisted.batchId,taskId:persisted.taskId,generationAttempt:persisted.generationAttempt,generationIdempotencyKey:persisted.generationIdempotencyKey,promptHash:persisted.promptHash,executionContextHash:persisted.executionContextHash},
 {batchId:"B33",taskId:"IMAGE-01",generationAttempt:1,generationIdempotencyKey:a.result.generationIdempotencyKey,promptHash:a.result.promptHash,executionContextHash:a.result.executionContextHash});
console.log("Runtime Verification Phase-33 artifact/task/batch/prompt/context traceability: PASS");
