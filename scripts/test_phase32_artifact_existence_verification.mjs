#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, ProductionWorkerRuntime, sha256 } from "./runtime/worker_runtime.mjs";

function runtime(adapter) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"phase32-"));
  const r=new ProductionWorkerRuntime({
    store:new JsonStateStore(path.join(dir,"task.json")),
    workerId:"PHASE32",
    artifactPersistenceRequired:true,
    outputAdapter:adapter,
    generator:{generate(){return {result:"SUCCESS",verification:"VERIFIED",output:{bytes:"IMAGE-BYTES",format:"png"}}}}
  });
  r.request({batchId:"B32",taskId:"IMAGE-01",module:"UNIVERSAL_WALLPAPER",productionType:"AUTOMATED",outputType:"DESKTOP_WALLPAPER",artifactPersistenceRequired:true});
  r.claim(); r.designAndLockPrompt("LOCKED", {reference:{status:"NO_REFERENCE"},sceneIntent:{status:"EXPLICIT",fields:{ACTIVITY:"TRAVEL",LOCATION:"FOREST",ACTION:"WALKING",TIME:"DAY",WEATHER:"CLEAR",SOCIAL_CONTEXT:"ALONE",ENVIRONMENTAL_CUES:"FOREST_PATH"}}}); r.authorizeAutomatedGeneration();
  return r;
}
{
 const r=runtime({persist({artifact}){return {result:"SUCCESS",verification:"VERIFIED",artifact:{artifactId:"A",uri:"storage://A",sha256:sha256(artifact.bytes)}}},verify({artifact}){return {result:"VERIFIED",verification:"VERIFIED",sha256:artifact.sha256}}});
 const x=r.execute(); assert.equal(x.result,"SUCCESS"); assert.equal(x.artifact.sha256,sha256("IMAGE-BYTES")); console.log("PASS retrievable artifact hash matches generated content");
}
{
 const r=runtime({persist(){return {result:"SUCCESS",verification:"VERIFIED",artifact:{artifactId:"A",uri:"storage://A",sha256:"WRONG"}}},verify(){return {result:"HASH_MISMATCH",verification:"VERIFIED"}}});
 const x=r.execute(); assert.equal(x.result,"FAILED"); assert.equal(x.taskStatus,"FAILED"); assert.equal(x.lastFailureReason,"OUTPUT_ARTIFACT_HASH_MISMATCH"); console.log("PASS artifact hash mismatch cannot produce SUCCESS");
}
{
 const r=runtime({persist(){return {result:"SUCCESS",verification:"VERIFIED",artifact:{artifactId:"A",uri:"storage://MISSING",sha256:sha256("IMAGE-BYTES")}}}, verify(){return {result:"NOT_FOUND",verification:"VERIFIED"}}});
 const x=r.execute(); assert.equal(x.result,"FAILED"); assert.equal(x.lastFailureReason,"OUTPUT_ARTIFACT_NOT_RETRIEVABLE"); console.log("PASS missing artifact cannot produce SUCCESS");
}
console.log("Runtime Verification Phase-32 artifact existence/retrieval verification: PASS");
