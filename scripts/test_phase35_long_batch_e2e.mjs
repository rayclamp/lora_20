#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { JsonStateStore, ProductionWorkerRuntime, sha256 } from "./runtime/worker_runtime.mjs";
import { AutomaticProductionController } from "./runtime/automatic_production_controller.mjs";
import { DeterministicWallpaperDesigner } from "./runtime/production_designer.mjs";
class Store{constructor(s){this.s=JSON.parse(JSON.stringify(s));this.sha="S1"}read(){return {state:structuredClone(this.s),sha:this.sha}}compareAndSwap(e,s){if(e!==this.sha)throw Error("STALE");this.s=structuredClone(s);this.sha="S"+Date.now()+Math.random();return this.read()}}
const tasks=Array.from({length:10},(_,i)=>({taskId:"IMAGE-"+String(i+1).padStart(2,"0"),status:"QUEUED"}));
const batch={batchId:"B35",automationRunId:"A35",module:"UNIVERSAL_WALLPAPER",productionType:"AUTOMATED",outputType:"DESKTOP_WALLPAPER",targetCount:10,completedCount:0,currentTaskId:"NONE",checkpointVersion:0,sessionStatus:"ACTIVE"};
const store=new Store(batch), dir=fs.mkdtempSync(path.join(os.tmpdir(),"phase35-")); let calls=0;
const runtimes=new Map();
const resolver=()=>{const t=tasks.find(x=>x.status==="QUEUED");if(t){t.status="RUNNING";return t}return null};
const controller=new AutomaticProductionController({batchRecord:batch,batchStore:store,taskResolver:()=>{const t=tasks.find(x=>x.status==="QUEUED");return t??null},taskDesignContext:()=>({theme:"TRAVEL",sceneIntent:{status:"EXPLICIT",fields:{ACTIVITY:"TRAVEL",LOCATION:"CITY",ACTION:"WALKING",TIME:"DAY",WEATHER:"CLEAR",SOCIAL_CONTEXT:"ALONE",ENVIRONMENTAL_CUES:"STREET"}}}),userRequest:"Long batch",runtimeFactory:()=>{const taskId=tasks.find(x=>x.status==="QUEUED")?.taskId||"NONE";const runtime=new ProductionWorkerRuntime({store:new JsonStateStore(path.join(dir,taskId+".json")),workerId:"P35",designer:new DeterministicWallpaperDesigner(),visualAdherenceRequired:false,generator:{generate({prompt,outputType}){calls++;return {result:"SUCCESS",verification:"VERIFIED",output:{format:outputType,bytes:taskId,promptHash:sha256(prompt)}}}}});runtimes.set(taskId,runtime);return runtime;}});
const result=controller.start(); assert.equal(result.action,"BATCH_COMPLETE"); assert.equal(controller.batchRecord.completedCount,10); assert.equal(controller.batchRecord.sessionStatus,"COMPLETED"); assert.equal(calls,10); assert.equal(new Set(tasks.map(t=>t.status)).size,1); assert.equal(tasks.every(t=>t.status==="SUCCESS"),true); console.log("Runtime Verification Phase-35 long 10-task automatic batch: PASS");
