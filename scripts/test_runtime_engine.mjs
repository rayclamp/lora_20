#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {RuntimeEngine} from "./runtime_engine.mjs";

let passed=0;
function test(name,fn){try{fn();console.log("[PASS] "+name);passed++;}catch(e){console.error("[FAIL] "+name+" :: "+e.message);process.exitCode=1;}}

const dir=fs.mkdtempSync(path.join(os.tmpdir(),"inaria-runtime-"));
const file=path.join(dir,"runtime.json");
const rt=new RuntimeEngine({file});

rt.createTask({TASK_ID:"TASK_001",MODULE_ID:"FESTIVAL_WALLPAPER",DESIGN_LOCK:true,FORMAT_LOCK:true});
test("persistent task survives reload",()=>{
  const reloaded=new RuntimeEngine({file});
  assert.equal(reloaded.task("TASK_001").STATUS,"QUEUED");
});

test("paused module cannot claim",()=>{
  assert.throws(()=>rt.claim("TASK_001","WORKER_A",60000,false),/MODULE_NOT_ACTIVE/);
});

rt.claim("TASK_001","WORKER_A",60000,true);
test("second worker cannot claim live task",()=>{
  assert.throws(()=>rt.claim("TASK_001","WORKER_B",60000,true),/TASK_NOT_QUEUED/);
});

rt.startGeneration("TASK_001","WORKER_A");
rt.recordResult("TASK_001","WORKER_A",{result:"SUCCESS",resultReference:"mock://image/001",outputCount:1});
rt.release("TASK_001","WORKER_A");

test("happy path reaches IMAGE_CREATED",()=>{
  assert.equal(rt.task("TASK_001").STATUS,"IMAGE_CREATED");
  assert.equal(rt.store.events.filter(e=>e.TASK_ID==="TASK_001").length,5);
});

rt.createTask({TASK_ID:"TASK_002",MODULE_ID:"FESTIVAL_WALLPAPER"});
rt.claim("TASK_002","WORKER_A",60000,true);
rt.startGeneration("TASK_002","WORKER_A");
rt.recordResult("TASK_002","WORKER_A",{result:"FAILED",errorCode:"MOCK_FAILURE"});
rt.release("TASK_002","WORKER_A");
rt.retry("TASK_002");

test("FAILED can be explicitly retried",()=>assert.equal(rt.task("TASK_002").STATUS,"QUEUED"));

rt.claim("TASK_002","WORKER_A",60000,true);
rt.startGeneration("TASK_002","WORKER_A");
rt.recordResult("TASK_002","WORKER_A",{result:"UNKNOWN",errorMessage:"mock timeout"});
rt.release("TASK_002","WORKER_A");

test("UNKNOWN requires recovery",()=>{
  assert.equal(rt.task("TASK_002").STATUS,"UNKNOWN");
  assert.throws(()=>rt.retry("TASK_002"),/ONLY_FAILED_IS_RETRYABLE/);
});

rt.recover("TASK_002","RETRY_AUTHORIZED","evidence reviewed");
test("explicit recovery may authorize retry",()=>assert.equal(rt.task("TASK_002").STATUS,"QUEUED"));

rt.createTask({TASK_ID:"TASK_003",MODULE_ID:"FESTIVAL_WALLPAPER",EXPECTED_OUTPUT_COUNT:1});
rt.claim("TASK_003","WORKER_A",60000,true);
rt.startGeneration("TASK_003","WORKER_A");
rt.recordResult("TASK_003","WORKER_A",{result:"SUCCESS",resultReference:"mock://image/003a",outputCount:2});
test("output count mismatch is persisted",()=>{
  const t=rt.task("TASK_003");
  assert.equal(t.STATUS,"IMAGE_CREATED");
  assert.equal(t.ERROR.ERROR_CODE,"OUTPUT_COUNT_MISMATCH");
});

rt.createTask({TASK_ID:"TASK_004",MODULE_ID:"FESTIVAL_WALLPAPER"});
rt.claim("TASK_004","WORKER_A",1,true);
test("stale worker cannot mutate expired lease",()=>{
  assert.throws(()=>rt.startGeneration("TASK_004","WORKER_A"),/LEASE_EXPIRED/);
});

rt.createTask({TASK_ID:"TASK_005",MODULE_ID:"FESTIVAL_WALLPAPER"});
rt.claim("TASK_005","WORKER_A",60000,true);
test("wrong worker cannot mutate claim",()=>{
  assert.throws(()=>rt.startGeneration("TASK_005","WORKER_B"),/CLAIM_OWNER_MISMATCH/);
});

rt.createTask({TASK_ID:"TASK_006",MODULE_ID:"FESTIVAL_WALLPAPER"});
rt.setCircuit("FESTIVAL_WALLPAPER",true);
test("circuit breaker blocks claims",()=>{
  assert.equal(rt.canClaim("FESTIVAL_WALLPAPER"),false);
  assert.throws(()=>rt.claim("TASK_006","WORKER_A",60000,true),/CIRCUIT_OPEN/);
});
rt.setCircuit("FESTIVAL_WALLPAPER",false);

rt.claim("TASK_006","WORKER_A",60000,true);
const beforeCAS=rt.task("TASK_006").STATE_VERSION;
test("CAS accepts current version",()=>{
  rt.casUpdate("TASK_006","WORKER_A",beforeCAS,t=>{t.ERROR.ERROR_CODE="CAS_OK";});
  assert.equal(rt.task("TASK_006").ERROR.ERROR_CODE,"CAS_OK");
});
test("CAS rejects stale version",()=>{
  assert.throws(()=>rt.casUpdate("TASK_006","WORKER_A",beforeCAS,t=>{t.ERROR.ERROR_CODE="STALE";}),/CAS_CONFLICT/);
});

test("append-only event history exists",()=>{
  assert.ok(rt.store.events.length>=20);
  for(let i=1;i<rt.store.events.length;i++) assert.notEqual(rt.store.events[i].EVENT_ID,rt.store.events[i-1].EVENT_ID);
});

if(process.exitCode) process.exit(1);
console.log("\nRuntime smoke tests PASSED: "+passed+" scenarios.");
