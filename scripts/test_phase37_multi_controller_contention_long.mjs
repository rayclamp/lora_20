#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs"; import os from "node:os"; import path from "node:path";
import { JsonStateStore, ProductionWorkerRuntime, sha256 } from "./runtime/worker_runtime.mjs";
const root=fs.mkdtempSync(path.join(os.tmpdir(),"phase37-"));
for(let i=1;i<=10;i++){
 const id="IMAGE-"+String(i).padStart(2,"0"), store=new JsonStateStore(path.join(root,id+".json"));
 const make=(workerId)=>new ProductionWorkerRuntime({store,workerId,visualAdherenceRequired:false,generator:{generate({prompt}){return {result:"SUCCESS",verification:"VERIFIED",output:{bytes:id,format:"png",promptHash:sha256(prompt)}}}}});
 const a=make("CONTROLLER-A-"+i), b=make("CONTROLLER-B-"+i);
 const req={batchId:"B37",taskId:id,mode:"AUTOMATED",module:"UNIVERSAL_WALLPAPER",productionType:"AUTOMATED",outputType:"DESKTOP_WALLPAPER",visualAdherenceRequired:false};
 a.request(req); b.request(req); a.claim();
 assert.throws(()=>b.claim(),/TASK_ALREADY_CLAIMED|CLAIM|OWNERSHIP/);
 a.designAndLockPrompt("P37-"+id,{reference:{status:"NO_REFERENCE"},sceneIntent:{status:"EXPLICIT",fields:{ACTIVITY:"TRAVEL",LOCATION:"CITY",ACTION:"WALKING",TIME:"DAY",WEATHER:"CLEAR",SOCIAL_CONTEXT:"ALONE",ENVIRONMENTAL_CUES:"STREET"}}}); a.authorizeAutomatedGeneration(); const done=a.execute(); assert.equal(done.result,"SUCCESS"); assert.equal(store.read().taskStatus,"SUCCESS");
}
console.log("Runtime Verification Phase-37 repeated multi-controller contention boundary: PASS");
