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
const rt=new RuntimeEngine({file,root:process.cwd()});
const active="FESTIVAL_WALLPAPER";

rt.createGoal({GOAL_ID:"GOAL_001",MODULE_ID:active});
rt.createBatch({BATCH_ID:"BATCH_001",GOAL_ID:"GOAL_001"});
rt.createTask({TASK_ID:"TASK_001",MODULE_ID:active,GOAL_ID:"GOAL_001",BATCH_ID:"BATCH_001",DESIGN_LOCK:true,FORMAT_LOCK:true});

test("persistent task survives reload",()=>{
  assert.equal(new RuntimeEngine({file,root:process.cwd()}).task("TASK_001").STATUS,"QUEUED");
});

test("canonical authority blocks caller-supplied active override",()=>{
  assert.throws(()=>rt.claim("TASK_001","WORKER_A",60000,true),/TASK_NOT_QUEUED|RUNTIME_LOCK_CONFLICT/);
});
rt.setCircuit(active,false);

const rt2=new RuntimeEngine({file,root:process.cwd()});
rt2.createTask({TASK_ID:"TASK_UNIVERSAL",MODULE_ID:"UNIVERSAL_WALLPAPER"});
test("inactive workflow module cannot claim",()=>{
  assert.throws(()=>rt2.claim("TASK_UNIVERSAL","WORKER_A",60000),/ACTIVE_WORKFLOW_MODULE_MISMATCH/);
});
rt2.createTask({TASK_ID:"TASK_LORA",MODULE_ID:"LORA_PRODUCTION"});
test("paused module cannot claim",()=>{
  assert.throws(()=>rt2.claim("TASK_LORA","WORKER_A",60000),/ACTIVE_WORKFLOW_MODULE_MISMATCH|MODULE_NOT_ACTIVE/);
});

let current=rt.task("TASK_001");
current=rt.claim("TASK_001","WORKER_A",60000);
const claimId=current.CLAIM.CLAIM_ID;
test("second worker cannot claim live task",()=>{
  assert.throws(()=>rt.claim("TASK_001","WORKER_B",60000),/TASK_NOT_QUEUED/);
});
test("missing CAS version is rejected",()=>{
  assert.throws(()=>rt.startGeneration("TASK_001","WORKER_A",undefined,claimId),/EXPECTED_VERSION_REQUIRED/);
});
current=rt.startGeneration("TASK_001","WORKER_A",current.STATE_VERSION,claimId);
test("stale CAS write is rejected",()=>{
  assert.throws(()=>rt.recordResult("TASK_001","WORKER_A",current.STATE_VERSION-1,claimId,{result:"SUCCESS",outputCount:1}),/CAS_CONFLICT/);
});
current=rt.recordResult("TASK_001","WORKER_A",current.STATE_VERSION,claimId,{result:"SUCCESS",resultReference:"mock://image/001",outputCount:1});
current=rt.release("TASK_001","WORKER_A",current.STATE_VERSION,claimId);
test("happy path reaches IMAGE_CREATED",()=>{
  assert.equal(current.STATUS,"IMAGE_CREATED");
  assert.equal(current.CLAIM.WORKER_ID,null);
});

rt.createTask({TASK_ID:"TASK_FAIL",MODULE_ID:active});
current=rt.claim("TASK_FAIL","WORKER_A",60000); let failClaim=current.CLAIM.CLAIM_ID;
current=rt.startGeneration("TASK_FAIL","WORKER_A",current.STATE_VERSION,failClaim);
current=rt.recordResult("TASK_FAIL","WORKER_A",current.STATE_VERSION,failClaim,{result:"FAILED",errorCode:"MOCK_FAILURE"});
current=rt.release("TASK_FAIL","WORKER_A",current.STATE_VERSION,failClaim);
test("retry requires current CAS and cleared claim",()=>{
  assert.throws(()=>rt.retry("TASK_FAIL",current.STATE_VERSION-1),/CAS_CONFLICT/);
  assert.equal(rt.retry("TASK_FAIL",current.STATE_VERSION).STATUS,"QUEUED");
});

rt.createTask({TASK_ID:"TASK_UNKNOWN",MODULE_ID:active});
current=rt.claim("TASK_UNKNOWN","WORKER_A",60000); let unknownClaim=current.CLAIM.CLAIM_ID;
current=rt.startGeneration("TASK_UNKNOWN","WORKER_A",current.STATE_VERSION,unknownClaim);
current=rt.recordResult("TASK_UNKNOWN","WORKER_A",current.STATE_VERSION,unknownClaim,{result:"UNKNOWN",errorMessage:"mock timeout"});
current=rt.release("TASK_UNKNOWN","WORKER_A",current.STATE_VERSION,unknownClaim);
test("UNKNOWN cannot retry directly",()=>{
  assert.throws(()=>rt.retry("TASK_UNKNOWN",current.STATE_VERSION),/ONLY_FAILED_IS_RETRYABLE/);
});
test("UNKNOWN recovery requires released claim and CAS",()=>{
  assert.equal(rt.recover("TASK_UNKNOWN","RETRY_AUTHORIZED",current.STATE_VERSION,"evidence reviewed").STATUS,"QUEUED");
});

rt.createTask({TASK_ID:"TASK_COUNT",MODULE_ID:active,EXPECTED_OUTPUT_COUNT:1});
current=rt.claim("TASK_COUNT","WORKER_A",60000); let countClaim=current.CLAIM.CLAIM_ID;
current=rt.startGeneration("TASK_COUNT","WORKER_A",current.STATE_VERSION,countClaim);
current=rt.recordResult("TASK_COUNT","WORKER_A",current.STATE_VERSION,countClaim,{result:"SUCCESS",resultReference:"mock://image/a",outputCount:2});
test("output-count mismatch is preserved as generation evidence",()=>{
  assert.equal(current.STATUS,"IMAGE_CREATED");
  assert.equal(current.ERROR.ERROR_CODE,"OUTPUT_COUNT_MISMATCH");
});

rt.createTask({TASK_ID:"TASK_EXPIRE",MODULE_ID:active});
current=rt.claim("TASK_EXPIRE","WORKER_A",1); const expireClaim=current.CLAIM.CLAIM_ID;
test("expired lease blocks mutation",()=>{
  assert.throws(()=>rt.startGeneration("TASK_EXPIRE","WORKER_A",current.STATE_VERSION,expireClaim),/LEASE_EXPIRED/);
});

rt.createTask({TASK_ID:"TASK_CAS",MODULE_ID:active});
current=rt.claim("TASK_CAS","WORKER_A",60000); const casClaim=current.CLAIM.CLAIM_ID; const casVersion=current.STATE_VERSION;
current=rt.casUpdate("TASK_CAS","WORKER_A",casVersion,casClaim,t=>{t.ERROR.ERROR_CODE="CAS_OK";});
test("CAS accepts current version and rejects stale version",()=>{
  assert.equal(current.ERROR.ERROR_CODE,"CAS_OK");
  assert.throws(()=>rt.casUpdate("TASK_CAS","WORKER_A",casVersion,casClaim,t=>{t.ERROR.ERROR_CODE="STALE";}),/CAS_CONFLICT/);
});

rt.createTask({TASK_ID:"TASK_IDEMP",MODULE_ID:active,IDEMPOTENCY_KEY:"IDEMP_001"});
current=rt.claim("TASK_IDEMP","WORKER_A",60000); let idemClaim=current.CLAIM.CLAIM_ID;
current=rt.startGeneration("TASK_IDEMP","WORKER_A",current.STATE_VERSION,idemClaim);
current=rt.recordResult("TASK_IDEMP","WORKER_A",current.STATE_VERSION,idemClaim,{result:"SUCCESS",outputCount:1});
current=rt.release("TASK_IDEMP","WORKER_A",current.STATE_VERSION,idemClaim);
test("completed idempotency key cannot be claimed again",()=>{
  assert.throws(()=>rt.claim("TASK_IDEMP","WORKER_A",60000),/IDEMPOTENCY_ALREADY_COMPLETED/);
});

rt.createTask({TASK_ID:"TASK_LOCK",MODULE_ID:active});
fs.mkdirSync(file+".lock");
test("runtime lock blocks concurrent writer",()=>{
  assert.throws(()=>rt.claim("TASK_LOCK","WORKER_A",60000),/RUNTIME_LOCK_CONFLICT/);
});
fs.rmSync(file+".lock",{recursive:true,force:true});

rt.createTask({TASK_ID:"TASK_WORKER",MODULE_ID:active});
const workerResult=rt.runWorker(["TASK_WORKER"],"WORKER_AUTO",{generate:()=>({result:"SUCCESS",resultReference:"mock://worker",outputCount:1})});
test("executable worker lifecycle reaches IMAGE_CREATED",()=>{
  assert.equal(workerResult[0].STATUS,"IMAGE_CREATED");
  assert.equal(workerResult[0].CLAIM.WORKER_ID,null);
});

rt.createTask({TASK_ID:"TASK_BREAKER_1",MODULE_ID:active});
rt.createTask({TASK_ID:"TASK_BREAKER_2",MODULE_ID:active});
rt.createTask({TASK_ID:"TASK_BREAKER_3",MODULE_ID:active});
for(const id of ["TASK_BREAKER_1","TASK_BREAKER_2","TASK_BREAKER_3"]){
  current=rt.claim(id,"WORKER_A",60000); const c=current.CLAIM.CLAIM_ID;
  current=rt.startGeneration(id,"WORKER_A",current.STATE_VERSION,c);
  current=rt.recordResult(id,"WORKER_A",current.STATE_VERSION,c,{result:"FAILED",errorCode:"TOOL_FAILURE"});
  current=rt.release(id,"WORKER_A",current.STATE_VERSION,c);
}
test("third genuine generation failure opens circuit",()=>{
  assert.equal(rt.canClaim(active),false);
  assert.equal(rt.store.counters.consecutiveGenerationErrors[active],3);
});
rt.setCircuit(active,false);
test("successful IMAGE_CREATED resets consecutive error counter",()=>{
  rt.createTask({TASK_ID:"TASK_RESET",MODULE_ID:active});
  const r=rt.runWorker(["TASK_RESET"],"WORKER_RESET",{generate:()=>({result:"SUCCESS",outputCount:1})});
  assert.equal(r[0].STATUS,"IMAGE_CREATED");
  assert.equal(rt.store.counters.consecutiveGenerationErrors[active],0);
});

test("append-only event history exists",()=>{
  assert.ok(rt.store.events.length>=30);
  for(let i=1;i<rt.store.events.length;i++) assert.notEqual(rt.store.events[i].EVENT_ID,rt.store.events[i-1].EVENT_ID);
});

if(process.exitCode) process.exit(1);
console.log("\nRuntime smoke tests PASSED: "+passed+" scenarios.");
