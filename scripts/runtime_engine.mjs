#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

export const STATES = new Set([
  "QUEUED","CLAIMED","GENERATING","IMAGE_CREATED","FAILED",
  "UNKNOWN","RECOVERY_REQUIRED","BLOCKED"
]);

const TERMINAL = new Set(["IMAGE_CREATED","FAILED","UNKNOWN","RECOVERY_REQUIRED","BLOCKED"]);

export class RuntimeEngine {
  constructor(options = {}) {
    this.file = options.file || null;
    this.root = options.root || process.cwd();
    this.now = options.now || (() => new Date().toISOString());
    this.lockDir = this.file ? this.file + ".lock" : null;
    this.store = {schemaVersion:"1.1",tasks:{},goals:{},batches:{},events:[],circuit:{},counters:{consecutiveGenerationErrors:{}}};
    if (this.file && fs.existsSync(this.file)) {
      this.store = JSON.parse(fs.readFileSync(this.file,"utf8"));
      this.store.schemaVersion ||= "1.1";
      this.store.goals ||= {}; this.store.batches ||= {}; this.store.events ||= [];
      this.store.circuit ||= {}; this.store.counters ||= {consecutiveGenerationErrors:{}};
      this.store.counters.consecutiveGenerationErrors ||= {};
    }
  }

  persist() {
    if (!this.file) return;
    fs.mkdirSync(path.dirname(this.file),{recursive:true});
    const tmp=this.file+".tmp";
    fs.writeFileSync(tmp,JSON.stringify(this.store,null,2));
    fs.renameSync(tmp,this.file);
  }

  withLock(fn) {
    if (!this.file) return fn();
    fs.mkdirSync(path.dirname(this.lockDir),{recursive:true});
    try { fs.mkdirSync(this.lockDir); }
    catch(e) { if(e.code==="EEXIST") throw new Error("RUNTIME_LOCK_CONFLICT"); throw e; }
    try { return fn(); } finally { fs.rmSync(this.lockDir,{recursive:true,force:true}); }
  }

  task(id) {
    const t=this.store.tasks[id]; if(!t) throw new Error("TASK_NOT_FOUND");
    return structuredClone(t);
  }

  createGoal(input) {
    return this.withLock(()=>{
      if(!input.GOAL_ID||!input.MODULE_ID) throw new Error("INVALID_GOAL");
      if(this.store.goals[input.GOAL_ID]) throw new Error("DUPLICATE_GOAL_ID");
      this.store.goals[input.GOAL_ID]={GOAL_ID:input.GOAL_ID,MODULE_ID:input.MODULE_ID,STATUS:input.STATUS??"ACTIVE",CREATED_AT:this.now()};
      this.persist(); return structuredClone(this.store.goals[input.GOAL_ID]);
    });
  }

  createBatch(input) {
    return this.withLock(()=>{
      if(!input.BATCH_ID||!input.GOAL_ID) throw new Error("INVALID_BATCH");
      const goal=this.store.goals[input.GOAL_ID]; if(!goal) throw new Error("GOAL_NOT_FOUND");
      if(input.MODULE_ID&&input.MODULE_ID!==goal.MODULE_ID) throw new Error("BATCH_MODULE_MISMATCH");
      if(this.store.batches[input.BATCH_ID]) throw new Error("DUPLICATE_BATCH_ID");
      this.store.batches[input.BATCH_ID]={BATCH_ID:input.BATCH_ID,GOAL_ID:input.GOAL_ID,MODULE_ID:goal.MODULE_ID,STATUS:input.STATUS??"ACTIVE",CREATED_AT:this.now()};
      this.persist(); return structuredClone(this.store.batches[input.BATCH_ID]);
    });
  }

  assertCanonicalRuntime(moduleId) {
    const statePath=path.join(this.root,"00_MASTER","RUNTIME_STATE.md");
    const registryPath=path.join(this.root,"00_MASTER","MODULE_REGISTRY.md");
    if(!fs.existsSync(statePath)||!fs.existsSync(registryPath)) throw new Error("CANONICAL_RUNTIME_STATE_UNAVAILABLE");
    const state=fs.readFileSync(statePath,"utf8");
    const registry=fs.readFileSync(registryPath,"utf8");
    const activeMatch=state.match(/ACTIVE_WORKFLOW:\s*[\s\S]*?MODULE:\s*([A-Z0-9_]+)/);
    if(!activeMatch) throw new Error("CANONICAL_ACTIVE_MODULE_UNRESOLVED");
    if(activeMatch[1]!==moduleId) throw new Error("ACTIVE_WORKFLOW_MODULE_MISMATCH");
    const lines=registry.split(/\r?\n/);
    const row=lines.find(line=>line.trim().startsWith("| "+moduleId+" |"));
    if(!row || !/\|\s*ACTIVE\s*\|/.test(row)) throw new Error("MODULE_NOT_ACTIVE");
    return moduleId;
  }

  assertHierarchy(t) {
    this.assertCanonicalRuntime(t.MODULE_ID);
    if(t.GOAL_ID) {
      const goal=this.store.goals[t.GOAL_ID]; if(!goal) throw new Error("GOAL_NOT_FOUND");
      if(goal.MODULE_ID!==t.MODULE_ID) throw new Error("GOAL_MODULE_MISMATCH");
      if(goal.STATUS!=="ACTIVE") throw new Error("GOAL_NOT_ACTIVE");
    }
    if(t.BATCH_ID) {
      const batch=this.store.batches[t.BATCH_ID]; if(!batch) throw new Error("BATCH_NOT_FOUND");
      if(batch.MODULE_ID!==t.MODULE_ID) throw new Error("BATCH_MODULE_MISMATCH");
      if(t.GOAL_ID&&batch.GOAL_ID!==t.GOAL_ID) throw new Error("BATCH_GOAL_MISMATCH");
      if(batch.STATUS!=="ACTIVE") throw new Error("BATCH_NOT_ACTIVE");
    }
  }

  createTask(input) {
    return this.withLock(()=>{
      if(!input.TASK_ID||!input.MODULE_ID) throw new Error("INVALID_TASK");
      if(this.store.tasks[input.TASK_ID]) throw new Error("DUPLICATE_TASK_ID");
      if(input.GOAL_ID) {
        const goal=this.store.goals[input.GOAL_ID]; if(!goal) throw new Error("GOAL_NOT_FOUND");
        if(goal.MODULE_ID!==input.MODULE_ID) throw new Error("GOAL_MODULE_MISMATCH");
      }
      if(input.BATCH_ID) {
        const batch=this.store.batches[input.BATCH_ID]; if(!batch) throw new Error("BATCH_NOT_FOUND");
        if(batch.MODULE_ID!==input.MODULE_ID) throw new Error("BATCH_MODULE_MISMATCH");
        if(input.GOAL_ID&&batch.GOAL_ID!==input.GOAL_ID) throw new Error("BATCH_GOAL_MISMATCH");
      }
      const t={
        SCHEMA_VERSION:"1.1",TASK_ID:input.TASK_ID,MODULE_ID:input.MODULE_ID,
        GOAL_ID:input.GOAL_ID??null,BATCH_ID:input.BATCH_ID??null,STATUS:"QUEUED",
        CREATED_AT:this.now(),UPDATED_AT:this.now(),STATE_VERSION:1,
        DESIGN:{DESIGN_LOCK:Boolean(input.DESIGN_LOCK),FORMAT_LOCK:Boolean(input.FORMAT_LOCK),EXPECTED_OUTPUT_COUNT:input.EXPECTED_OUTPUT_COUNT??1,MODULE_PAYLOAD_REF:input.MODULE_PAYLOAD_REF??null},
        EXECUTION:{ATTEMPT_COUNT:0,GENERATION_RESULT:null,RESULT_REFERENCE:null,OUTPUT_COUNT:null},
        CLAIM:{CLAIM_ID:null,WORKER_ID:null,CLAIMED_AT:null,LEASE_EXPIRES_AT:null},
        RECOVERY:{RECOVERY_STATUS:"NONE",RECOVERY_REASON:null,RECOVERY_EVENT_ID:null},
        ERROR:{ERROR_CODE:null,ERROR_MESSAGE:null},
        INTEGRITY:{CURRENT_EVENT_ID:null,IDEMPOTENCY_KEY:input.IDEMPOTENCY_KEY??input.TASK_ID}
      };
      this.store.tasks[t.TASK_ID]=t; this.event("TASK_CREATED",t,{}); this.persist(); return this.task(t.TASK_ID);
    });
  }

  event(type,t,extra={}) {
    const id="EVT_"+String(this.store.events.length+1).padStart(6,"0");
    const e={EVENT_ID:id,EVENT_TYPE:type,TASK_ID:t.TASK_ID,MODULE_ID:t.MODULE_ID,
      STATE_VERSION_BEFORE:extra.before??t.STATE_VERSION,STATE_VERSION_AFTER:extra.after??t.STATE_VERSION,
      TIMESTAMP:this.now(),WORKER_ID:t.CLAIM.WORKER_ID,CLAIM_ID:t.CLAIM.CLAIM_ID,
      ATTEMPT_ID:extra.attemptId??null,RESULT:extra.result??null,ERROR_CODE:extra.errorCode??null};
    this.store.events.push(e); t.INTEGRITY.CURRENT_EVENT_ID=id; return e;
  }

  assertVersion(t,expected) {
    if(expected===undefined||expected===null) throw new Error("EXPECTED_VERSION_REQUIRED");
    if(t.STATE_VERSION!==expected) throw new Error("CAS_CONFLICT");
  }

  requireLease(t,workerId,claimId) {
    if(t.STATUS!=="CLAIMED"&&t.STATUS!=="GENERATING") throw new Error("TASK_NOT_CLAIMED");
    if(t.CLAIM.WORKER_ID!==workerId) throw new Error("CLAIM_OWNER_MISMATCH");
    if(claimId&&t.CLAIM.CLAIM_ID!==claimId) throw new Error("CLAIM_ID_MISMATCH");
    if(!t.CLAIM.LEASE_EXPIRES_AT||Date.parse(t.CLAIM.LEASE_EXPIRES_AT)<=Date.now()) throw new Error("LEASE_EXPIRED");
  }

  assertClaim(t,workerId,expectedVersion,claimId) {
    this.assertVersion(t,expectedVersion); this.requireLease(t,workerId,claimId);
  }

  claim(taskId,workerId,leaseMs) {
    return this.withLock(()=>{
      const t=this.store.tasks[taskId]; if(!t) throw new Error("TASK_NOT_FOUND");
      this.assertHierarchy(t);
      if(!this.canClaim(t.MODULE_ID)) throw new Error("CIRCUIT_OPEN");
      if(t.STATUS!=="QUEUED") throw new Error("TASK_NOT_QUEUED");
      const idem=t.INTEGRITY.IDEMPOTENCY_KEY;
      if(this.store.events.some(e=>e.EVENT_TYPE==="GENERATION_RESULT"&&e.TASK_ID===taskId&&e.ATTEMPT_ID==="IDEMPOTENCY:"+idem))
        throw new Error("IDEMPOTENCY_ALREADY_COMPLETED");
      const claimId="CLM_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,8);
      const before=t.STATE_VERSION,now=Date.now();
      t.STATUS="CLAIMED"; t.STATE_VERSION++; t.UPDATED_AT=this.now();
      t.CLAIM={CLAIM_ID:claimId,WORKER_ID:workerId,CLAIMED_AT:new Date(now).toISOString(),LEASE_EXPIRES_AT:new Date(now+leaseMs).toISOString()};
      this.event("TASK_CLAIMED",t,{before,after:t.STATE_VERSION}); this.persist(); return this.task(taskId);
    });
  }

  startGeneration(taskId,workerId,expectedVersion,claimId) {
    return this.withLock(()=>{
      const t=this.store.tasks[taskId]; if(!t) throw new Error("TASK_NOT_FOUND");
      this.assertClaim(t,workerId,expectedVersion,claimId);
      const before=t.STATE_VERSION; t.STATUS="GENERATING"; t.STATE_VERSION++; t.UPDATED_AT=this.now(); t.EXECUTION.ATTEMPT_COUNT++;
      this.event("GENERATION_STARTED",t,{before,after:t.STATE_VERSION,attemptId:"ATT_"+t.EXECUTION.ATTEMPT_COUNT});
      this.persist(); return this.task(taskId);
    });
  }

  recordResult(taskId,workerId,expectedVersion,claimId,result) {
    return this.withLock(()=>{
      const t=this.store.tasks[taskId]; if(!t) throw new Error("TASK_NOT_FOUND");
      this.assertClaim(t,workerId,expectedVersion,claimId);
      if(!["SUCCESS","FAILED","UNKNOWN"].includes(result.result)) throw new Error("INVALID_RESULT");
      const idem=t.INTEGRITY.IDEMPOTENCY_KEY;
      const prior=this.store.events.find(e=>e.EVENT_TYPE==="GENERATION_RESULT"&&e.TASK_ID===taskId&&e.ATTEMPT_ID==="IDEMPOTENCY:"+idem);
      if(prior) return this.task(taskId);
      const before=t.STATE_VERSION;
      t.EXECUTION.GENERATION_RESULT=result.result; t.EXECUTION.RESULT_REFERENCE=result.resultReference??null; t.EXECUTION.OUTPUT_COUNT=result.outputCount??null;
      if(result.result==="SUCCESS"){
        t.STATUS="IMAGE_CREATED";
        if(t.EXECUTION.OUTPUT_COUNT!==t.DESIGN.EXPECTED_OUTPUT_COUNT) t.ERROR={ERROR_CODE:"OUTPUT_COUNT_MISMATCH",ERROR_MESSAGE:"Actual output count differs from expected"};
        this.store.counters.consecutiveGenerationErrors[t.MODULE_ID]=0;
      } else if(result.result==="FAILED"){
        t.STATUS="FAILED"; t.ERROR={ERROR_CODE:result.errorCode??"GENERATION_FAILED",ERROR_MESSAGE:result.errorMessage??null};
        const n=(this.store.counters.consecutiveGenerationErrors[t.MODULE_ID]||0)+1;
        this.store.counters.consecutiveGenerationErrors[t.MODULE_ID]=n; if(n>=3) this.store.circuit[t.MODULE_ID]="OPEN";
      } else {
        t.STATUS="UNKNOWN"; t.RECOVERY={RECOVERY_STATUS:"RECOVERY_REQUIRED",RECOVERY_REASON:result.errorMessage??"Outcome uncertain",RECOVERY_EVENT_ID:null};
      }
      t.STATE_VERSION++; t.UPDATED_AT=this.now();
      const e=this.event("GENERATION_RESULT",t,{before,after:t.STATE_VERSION,result:result.result,errorCode:t.ERROR.ERROR_CODE,attemptId:"IDEMPOTENCY:"+idem});
      if(result.result==="UNKNOWN") t.RECOVERY.RECOVERY_EVENT_ID=e.EVENT_ID;
      this.persist(); return this.task(taskId);
    });
  }

  release(taskId,workerId,expectedVersion,claimId) {
    return this.withLock(()=>{
      const t=this.store.tasks[taskId]; if(!t) throw new Error("TASK_NOT_FOUND");
      this.assertVersion(t,expectedVersion);
      if(t.CLAIM.WORKER_ID!==workerId) throw new Error("CLAIM_OWNER_MISMATCH");
      if(claimId&&t.CLAIM.CLAIM_ID!==claimId) throw new Error("CLAIM_ID_MISMATCH");
      if(!TERMINAL.has(t.STATUS)) throw new Error("RELEASE_NOT_ALLOWED");
      const before=t.STATE_VERSION; t.CLAIM={CLAIM_ID:null,WORKER_ID:null,CLAIMED_AT:null,LEASE_EXPIRES_AT:null};
      t.STATE_VERSION++; t.UPDATED_AT=this.now(); this.event("CLAIM_RELEASED",t,{before,after:t.STATE_VERSION}); this.persist(); return this.task(taskId);
    });
  }

  recover(taskId,outcome,expectedVersion,reason="") {
    return this.withLock(()=>{
      const t=this.store.tasks[taskId]; if(!t) throw new Error("TASK_NOT_FOUND");
      this.assertVersion(t,expectedVersion);
      if(t.STATUS!=="UNKNOWN"&&t.STATUS!=="RECOVERY_REQUIRED") throw new Error("TASK_NOT_RECOVERABLE");
      if(t.CLAIM.CLAIM_ID||t.CLAIM.WORKER_ID) throw new Error("CLAIM_MUST_BE_RELEASED_BEFORE_RECOVERY");
      const before=t.STATE_VERSION;
      if(outcome==="RECOVERED_SUCCESS"){t.STATUS="IMAGE_CREATED";t.RECOVERY.RECOVERY_STATUS="RECOVERED";}
      else if(outcome==="RECOVERED_FAILURE"){t.STATUS="FAILED";t.RECOVERY.RECOVERY_STATUS="RECOVERED";}
      else if(outcome==="RETRY_AUTHORIZED"){t.STATUS="QUEUED";t.RECOVERY.RECOVERY_STATUS="RECOVERED";}
      else if(outcome==="BLOCKED"){t.STATUS="BLOCKED";t.RECOVERY.RECOVERY_STATUS="BLOCKED";}
      else throw new Error("INVALID_RECOVERY_OUTCOME");
      t.RECOVERY.RECOVERY_REASON=reason; t.STATE_VERSION++; t.UPDATED_AT=this.now();
      this.event("RECOVERY_RESOLVED",t,{before,after:t.STATE_VERSION,result:outcome}); this.persist(); return this.task(taskId);
    });
  }

  casUpdate(taskId,workerId,expectedVersion,claimId,mutator) {
    return this.withLock(()=>{
      const t=this.store.tasks[taskId]; if(!t) throw new Error("TASK_NOT_FOUND");
      this.assertClaim(t,workerId,expectedVersion,claimId);
      const before=t.STATE_VERSION; mutator(t); t.STATE_VERSION++; t.UPDATED_AT=this.now();
      this.event("CAS_UPDATE",t,{before,after:t.STATE_VERSION}); this.persist(); return this.task(taskId);
    });
  }

  retry(taskId,expectedVersion) {
    return this.withLock(()=>{
      const t=this.store.tasks[taskId]; if(!t) throw new Error("TASK_NOT_FOUND");
      this.assertVersion(t,expectedVersion);
      if(t.STATUS!=="FAILED") throw new Error("ONLY_FAILED_IS_RETRYABLE");
      if(t.CLAIM.CLAIM_ID||t.CLAIM.WORKER_ID) throw new Error("CLAIM_MUST_BE_RELEASED_BEFORE_RETRY");
      if(!this.canClaim(t.MODULE_ID)) throw new Error("CIRCUIT_OPEN");
      const before=t.STATE_VERSION; t.STATUS="QUEUED"; t.EXECUTION.GENERATION_RESULT=null; t.EXECUTION.RESULT_REFERENCE=null; t.EXECUTION.OUTPUT_COUNT=null;
      t.ERROR={ERROR_CODE:null,ERROR_MESSAGE:null}; t.STATE_VERSION++; t.UPDATED_AT=this.now();
      this.event("RETRY_QUEUED",t,{before,after:t.STATE_VERSION}); this.persist(); return this.task(taskId);
    });
  }

  setCircuit(moduleId,open) {
    return this.withLock(()=>{this.store.circuit[moduleId]=open?"OPEN":"CLOSED";if(!open)this.store.counters.consecutiveGenerationErrors[moduleId]=0;this.persist();});
  }

  canClaim(moduleId){return this.store.circuit[moduleId]!=="OPEN";}

  runWorker(taskIds,workerId,adapter,leaseMs=60000) {
    if(!adapter||typeof adapter.generate!=="function") throw new Error("GENERATION_ADAPTER_REQUIRED");
    const results=[];
    for(const taskId of taskIds){
      let current=this.task(taskId); this.assertHierarchy(current);
      current=this.claim(taskId,workerId,leaseMs); const claimId=current.CLAIM.CLAIM_ID;
      try{
        current=this.startGeneration(taskId,workerId,current.STATE_VERSION,claimId);
        current=this.recordResult(taskId,workerId,current.STATE_VERSION,claimId,adapter.generate(structuredClone(current)));
      }catch(e){
        if(e.message==="UNKNOWN") current=this.recordResult(taskId,workerId,current.STATE_VERSION,claimId,{result:"UNKNOWN",errorMessage:"Outcome uncertain"});
        else throw e;
      }finally{
        current=this.task(taskId);
        if(TERMINAL.has(current.STATUS)&&current.CLAIM.WORKER_ID===workerId)
          current=this.release(taskId,workerId,current.STATE_VERSION,claimId);
      }
      results.push(current);
    }
    return results;
  }
}
