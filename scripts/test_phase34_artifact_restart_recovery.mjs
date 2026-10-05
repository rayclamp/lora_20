#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, ProductionWorkerRuntime, sha256 } from "./runtime/worker_runtime.mjs";
const dir=fs.mkdtempSync(path.join(os.tmpdir(),"phase34-")), statePath=path.join(dir,"task.json");
let providerCalls=0;
const store=new JsonStateStore(statePath);
const adapter={persist({artifact}){return {result:"SUCCESS",verification:"VERIFIED",artifact:{artifactId:"A34",uri:"storage://A34",sha256:sha256(artifact.bytes),retrievalVerification:"VERIFIED"}}},verify({artifact}){return {result:"VERIFIED",verification:"VERIFIED",sha256:artifact.sha256}}};
const make=()=>new ProductionWorkerRuntime({store,workerId:"P34",visualAdherenceRequired:false,artifactPersistenceRequired:true,outputAdapter:adapter,generator:{generate({outputType}){providerCalls++;return {result:"SUCCESS",verification:"VERIFIED",output:{bytes:"P34",format:outputType}}}}});
const r1=make(); r1.request({batchId:"B34",taskId:"IMAGE-01",mode:"AUTOMATED",module:"UNIVERSAL_WALLPAPER",productionType:"AUTOMATED",outputType:"DESKTOP_WALLPAPER",artifactPersistenceRequired:true,visualAdherenceRequired:false}); r1.claim(); r1.designAndLockPrompt("P34",{reference:{status:"NO_REFERENCE"},sceneIntent:{status:"EXPLICIT",fields:{ACTIVITY:"TRAVEL",LOCATION:"CITY",ACTION:"WALKING",TIME:"DAY",WEATHER:"CLEAR",SOCIAL_CONTEXT:"ALONE",ENVIRONMENTAL_CUES:"STREET"}}}); r1.authorizeAutomatedGeneration(); const done=r1.execute(); assert.equal(done.result,"SUCCESS"); assert.equal(providerCalls,1);
const r2=make(); const restored=r2.requireState(); assert.equal(restored.taskStatus,"SUCCESS"); assert.equal(restored.artifact.artifactId,"A34"); assert.equal(restored.artifact.taskId,"IMAGE-01"); assert.equal(restored.generationIdempotencyKey,done.generationIdempotencyKey); assert.equal(providerCalls,1);
assert.equal(restored.recovery,"TERMINAL_SUCCESS"); assert.equal(restored.ownership,"TERMINAL");
console.log("Runtime Verification Phase-34 artifact persistence crash/restart recovery: PASS");
