#!/usr/bin/env node
import assert from "node:assert/strict";
import { GitHubBatchRecordStore } from "./runtime/batch_record_store.mjs";
import { GitHubContentsStateStore, ProductionWorkerRuntime, MockGenerationAdapter } from "./runtime/worker_runtime.mjs";
import { DeterministicWallpaperDesigner } from "./runtime/production_designer.mjs";
import { AutomaticProductionController } from "./runtime/automatic_production_controller.mjs";

class FakeGitHubContentsClient {
  constructor(){this.files=new Map();this.n=0}
  getContents({path}){const x=this.files.get(path);return x?{content:Buffer.from(JSON.stringify(x.state)).toString("base64"),sha:x.sha}:null}
  updateContents({path,sha,content}){const x=this.files.get(path);if(sha===undefined&&x)throw new Error("FILE_ALREADY_EXISTS");if(sha!==undefined&&(!x||x.sha!==sha))throw new Error("STALE_CONTENT_SHA");const y={state:JSON.parse(Buffer.from(content,"base64").toString()),sha:"sha-"+(++this.n)};this.files.set(path,y);return {content:{sha:y.sha}}}
}
const client=new FakeGitHubContentsClient(), branch="runtime-verification/phase-3-control-runtime";
const batchPath="MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/RV-PHASE27.json";
const taskPath="MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/STATE/RV-PHASE27-IMAGE-01.json";
const store=new GitHubBatchRecordStore({client,owner:"rayclamp",repo:"lora_20",path:batchPath,branch});
const base={batchId:"RV-PHASE27-BATCH",automationRunId:"RV-PHASE27-AUTO",module:"UNIVERSAL_WALLPAPER",productionType:"AUTOMATED",outputType:"DESKTOP_WALLPAPER",targetCount:1,completedCount:0,currentTaskId:"NONE",checkpointVersion:0,sessionStatus:"ACTIVE",stopReason:"NONE",terminationStatus:"NON_TERMINAL",tasks:[{taskId:"IMAGE-01",status:"QUEUED",recoveryStatus:"NONE",attemptCount:0}]};
store.create(base);
const ctx={theme:"TRAVEL",sceneIntent:{status:"EXPLICIT",fields:{ACTIVITY:"TRAVEL",LOCATION:"CITY",ACTION:"WALKING",TIME:"DAY",WEATHER:"CLEAR",SOCIAL_CONTEXT:"ALONE",ENVIRONMENTAL_CUES:"URBAN"}},aspectRatio:"16:9",modelId:"TEST",modelVersion:"1"};
const runtime=(responses,id)=>new ProductionWorkerRuntime({store:new GitHubContentsStateStore({client,owner:"rayclamp",repo:"lora_20",path:taskPath,branch}),generator:new MockGenerationAdapter(responses),designer:new DeterministicWallpaperDesigner(),visualEvaluator:{evaluate:()=>({result:"VISUAL_DESIGN_ADHERENCE_PASS"})},workerId:id,leaseDurationMs:1000});
const make=(responses,id)=>new AutomaticProductionController({batchRecord:base,batchStore:store,taskResolver:b=>b.tasks.find(t=>t.status==="QUEUED"||t.recoveryStatus==="RETRY_READY")??null,taskDesignContext:()=>ctx,userRequest:"travel",runtimeFactory:()=>runtime(responses,id)});

// Case A: controller crashes after FAILED checkpoint. Fresh controller must resume the persisted RETRY_READY state.
let c1=make(["FAILED"],"P27-A");
assert.equal(c1.start().action,"RETRY_READY");
let persisted=store.read().state; assert.equal(persisted.sessionStatus,"RECOVERY_REQUIRED"); assert.equal(persisted.tasks[0].recoveryStatus,"RETRY_READY");
let c2=make(["SUCCESS"],"P27-B");
assert.equal(c2.retryCurrentTask().action,"BATCH_COMPLETE");
persisted=store.read().state; assert.equal(persisted.tasks[0].status,"SUCCESS"); assert.equal(persisted.completedCount,1);

// Case B: UNKNOWN must remain terminal across controller restart and cannot be retried.
const base2=structuredClone(base); base2.batchId="RV-PHASE27-UNKNOWN"; base2.tasks=[{taskId:"IMAGE-01",status:"QUEUED",recoveryStatus:"NONE",attemptCount:0}];
const store2=new GitHubBatchRecordStore({client,owner:"rayclamp",repo:"lora_20",path:"MODULES/UNIVERSAL_WALLPAPER/PRODUCTION/BATCHES/RV-PHASE27-UNKNOWN.json",branch});
store2.create(base2);
const u1=new AutomaticProductionController({batchRecord:base2,batchStore:store2,taskResolver:b=>b.tasks.find(t=>t.status==="QUEUED")??null,taskDesignContext:()=>ctx,userRequest:"travel",runtimeFactory:()=>runtime(["UNKNOWN"],"P27-U")});
assert.equal(u1.start().action,"RECOVERY_REQUIRED");
assert.equal(store2.read().state.terminationStatus,"TERMINAL");
const u2=new AutomaticProductionController({batchRecord:base2,batchStore:store2,taskResolver:b=>b.tasks.find(t=>t.status==="QUEUED")??null,taskDesignContext:()=>ctx,userRequest:"travel",runtimeFactory:()=>runtime(["SUCCESS"],"P27-U2")});
assert.throws(()=>u2.start(),/BATCH_NOT_ACTIVE/);
console.log("Runtime Verification Phase-27 restart recovery semantics: PASS");
console.log("PASS FAILED/RETRY_READY survives controller restart");
console.log("PASS retry executes exactly once and reaches BATCH_COMPLETE");
console.log("PASS UNKNOWN remains terminal across restart");
