#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

export const STATES = new Set([
  "QUEUED","CLAIMED","GENERATING","IMAGE_CREATED","FAILED",
  "UNKNOWN","RECOVERY_REQUIRED","BLOCKED"
]);

export class RuntimeEngine {
  constructor(options = {}) {
    this.file = options.file || null;
    this.now = options.now || (() => new Date().toISOString());
    this.store = { tasks: {}, events: [], circuit: {} };
    if (this.file && fs.existsSync(this.file)) this.store = JSON.parse(fs.readFileSync(this.file,"utf8"));
  }

  persist() {
    if (!this.file) return;
    fs.mkdirSync(path.dirname(this.file), {recursive:true});
    const tmp = this.file + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(this.store,null,2));
    fs.renameSync(tmp,this.file);
  }

  task(id) {
    const t=this.store.tasks[id];
    if (!t) throw new Error("TASK_NOT_FOUND");
    return structuredClone(t);
  }

  createTask(input) {
    if (!input.TASK_ID || !input.MODULE_ID) throw new Error("INVALID_TASK");
    if (this.store.tasks[input.TASK_ID]) throw new Error("DUPLICATE_TASK_ID");
    const t={
      SCHEMA_VERSION:"1.0", TASK_ID:input.TASK_ID, MODULE_ID:input.MODULE_ID,
      GOAL_ID:input.GOAL_ID ?? null, BATCH_ID:input.BATCH_ID ?? null,
      STATUS:"QUEUED", CREATED_AT:this.now(), UPDATED_AT:this.now(),
      STATE_VERSION:1,
      DESIGN:{DESIGN_LOCK:Boolean(input.DESIGN_LOCK),FORMAT_LOCK:Boolean(input.FORMAT_LOCK),
        EXPECTED_OUTPUT_COUNT:input.EXPECTED_OUTPUT_COUNT ?? 1,
        MODULE_PAYLOAD_REF:input.MODULE_PAYLOAD_REF ?? null},
      EXECUTION:{ATTEMPT_COUNT:0,GENERATION_RESULT:null,RESULT_REFERENCE:null,OUTPUT_COUNT:null},
      CLAIM:{CLAIM_ID:null,WORKER_ID:null,CLAIMED_AT:null,LEASE_EXPIRES_AT:null},
      RECOVERY:{RECOVERY_STATUS:"NONE",RECOVERY_REASON:null,RECOVERY_EVENT_ID:null},
      ERROR:{ERROR_CODE:null,ERROR_MESSAGE:null},
      INTEGRITY:{CURRENT_EVENT_ID:null,IDEMPOTENCY_KEY:input.IDEMPOTENCY_KEY ?? input.TASK_ID}
    };
    this.store.tasks[t.TASK_ID]=t;
    this.event("TASK_CREATED",t,{});
    this.persist();
    return this.task(t.TASK_ID);
  }

  event(type,t,extra={}) {
    const id="EVT_"+String(this.store.events.length+1).padStart(6,"0");
    const e={EVENT_ID:id,EVENT_TYPE:type,TASK_ID:t.TASK_ID,MODULE_ID:t.MODULE_ID,
      STATE_VERSION_BEFORE:extra.before ?? t.STATE_VERSION,
      STATE_VERSION_AFTER:extra.after ?? t.STATE_VERSION,
      TIMESTAMP:this.now(),WORKER_ID:t.CLAIM.WORKER_ID,CLAIM_ID:t.CLAIM.CLAIM_ID,
      ATTEMPT_ID:extra.attemptId ?? null,RESULT:extra.result ?? null,
      ERROR_CODE:extra.errorCode ?? null};
    this.store.events.push(e);
    t.INTEGRITY.CURRENT_EVENT_ID=id;
    return e;
  }

  assertVersion(t,expected) {
    if (t.STATE_VERSION !== expected) throw new Error("CAS_CONFLICT");
  }

  claim(taskId,workerId,leaseMs,moduleActive=true) {
    const t=this.store.tasks[taskId];
    if (!t) throw new Error("TASK_NOT_FOUND");
    if (!moduleActive) throw new Error("MODULE_NOT_ACTIVE");
    if (!this.canClaim(t.MODULE_ID)) throw new Error("CIRCUIT_OPEN");
    if (t.STATUS!=="QUEUED") throw new Error("TASK_NOT_QUEUED");
    const claimId="CLM_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,8);
    const before=t.STATE_VERSION, now=Date.now();
    t.STATUS="CLAIMED"; t.STATE_VERSION++; t.UPDATED_AT=this.now();
    t.CLAIM={CLAIM_ID:claimId,WORKER_ID:workerId,CLAIMED_AT:new Date(now).toISOString(),
      LEASE_EXPIRES_AT:new Date(now+leaseMs).toISOString()};
    this.event("TASK_CLAIMED",t,{before,after:t.STATE_VERSION});
    this.persist(); return this.task(taskId);
  }

  requireLease(t,workerId) {
    if (t.STATUS!=="CLAIMED" && t.STATUS!=="GENERATING") throw new Error("TASK_NOT_CLAIMED");
    if (t.CLAIM.WORKER_ID!==workerId) throw new Error("CLAIM_OWNER_MISMATCH");
    if (Date.parse(t.CLAIM.LEASE_EXPIRES_AT) <= Date.now()) throw new Error("LEASE_EXPIRED");
  }

  startGeneration(taskId,workerId) {
    const t=this.store.tasks[taskId]; if(!t) throw new Error("TASK_NOT_FOUND");
    this.requireLease(t,workerId);
    const before=t.STATE_VERSION;t.STATUS="GENERATING";t.STATE_VERSION++;t.UPDATED_AT=this.now();
    t.EXECUTION.ATTEMPT_COUNT++;
    this.event("GENERATION_STARTED",t,{before,after:t.STATE_VERSION,attemptId:"ATT_"+t.EXECUTION.ATTEMPT_COUNT});
    this.persist();return this.task(taskId);
  }

  recordResult(taskId,workerId,result) {
    const t=this.store.tasks[taskId]; if(!t) throw new Error("TASK_NOT_FOUND");
    this.requireLease(t,workerId);
    if(!["SUCCESS","FAILED","UNKNOWN"].includes(result.result)) throw new Error("INVALID_RESULT");
    const before=t.STATE_VERSION;
    t.EXECUTION.GENERATION_RESULT=result.result;
    t.EXECUTION.RESULT_REFERENCE=result.resultReference ?? null;
    t.EXECUTION.OUTPUT_COUNT=result.outputCount ?? null;
    if(result.result==="SUCCESS"){
      t.STATUS="IMAGE_CREATED";
      if(t.EXECUTION.OUTPUT_COUNT!==t.DESIGN.EXPECTED_OUTPUT_COUNT){
        t.ERROR={ERROR_CODE:"OUTPUT_COUNT_MISMATCH",ERROR_MESSAGE:"Actual output count differs from expected"};
      }
    } else if(result.result==="FAILED"){
      t.STATUS="FAILED"; t.ERROR={ERROR_CODE:result.errorCode??"GENERATION_FAILED",ERROR_MESSAGE:result.errorMessage??null};
    } else {
      t.STATUS="UNKNOWN";t.RECOVERY={RECOVERY_STATUS:"RECOVERY_REQUIRED",RECOVERY_REASON:result.errorMessage??"Outcome uncertain",RECOVERY_EVENT_ID:null};
    }
    t.STATE_VERSION++;t.UPDATED_AT=this.now();
    const e=this.event("GENERATION_RESULT",t,{before,after:t.STATE_VERSION,result:result.result,errorCode:t.ERROR.ERROR_CODE,attemptId:"ATT_"+t.EXECUTION.ATTEMPT_COUNT});
    if(result.result==="UNKNOWN") t.RECOVERY.RECOVERY_EVENT_ID=e.EVENT_ID;
    this.persist();return this.task(taskId);
  }

  release(taskId,workerId){
    const t=this.store.tasks[taskId]; if(!t) throw new Error("TASK_NOT_FOUND");
    if(t.CLAIM.WORKER_ID!==workerId) throw new Error("CLAIM_OWNER_MISMATCH");
    if(["IMAGE_CREATED","FAILED","UNKNOWN","RECOVERY_REQUIRED","BLOCKED"].includes(t.STATUS)){
      const before=t.STATE_VERSION;t.CLAIM={CLAIM_ID:null,WORKER_ID:null,CLAIMED_AT:null,LEASE_EXPIRES_AT:null};
      t.STATE_VERSION++;t.UPDATED_AT=this.now();this.event("CLAIM_RELEASED",t,{before,after:t.STATE_VERSION});
      this.persist();return this.task(taskId);
    }
    throw new Error("RELEASE_NOT_ALLOWED");
  }

  recover(taskId,outcome,reason=""){
    const t=this.store.tasks[taskId]; if(!t) throw new Error("TASK_NOT_FOUND");
    if(t.STATUS!=="UNKNOWN" && t.STATUS!=="RECOVERY_REQUIRED") throw new Error("TASK_NOT_RECOVERABLE");
    const before=t.STATE_VERSION;
    if(outcome==="RECOVERED_SUCCESS"){t.STATUS="IMAGE_CREATED";t.RECOVERY.RECOVERY_STATUS="RECOVERED";}
    else if(outcome==="RECOVERED_FAILURE"){t.STATUS="FAILED";t.RECOVERY.RECOVERY_STATUS="RECOVERED";}
    else if(outcome==="RETRY_AUTHORIZED"){t.STATUS="QUEUED";t.RECOVERY.RECOVERY_STATUS="RECOVERED";}
    else if(outcome==="BLOCKED"){t.STATUS="BLOCKED";t.RECOVERY.RECOVERY_STATUS="BLOCKED";}
    else throw new Error("INVALID_RECOVERY_OUTCOME");
    t.RECOVERY.RECOVERY_REASON=reason;t.STATE_VERSION++;t.UPDATED_AT=this.now();
    this.event("RECOVERY_RESOLVED",t,{before,after:t.STATE_VERSION,result:outcome});
    this.persist();return this.task(taskId);
  }

  casUpdate(taskId,workerId,expectedVersion,mutator){
    const t=this.store.tasks[taskId]; if(!t) throw new Error("TASK_NOT_FOUND");
    this.requireLease(t,workerId);
    this.assertVersion(t,expectedVersion);
    const before=t.STATE_VERSION;
    mutator(t);
    t.STATE_VERSION++; t.UPDATED_AT=this.now();
    this.event("CAS_UPDATE",t,{before,after:t.STATE_VERSION});
    this.persist();
    return this.task(taskId);
  }

  retry(taskId){
    const t=this.store.tasks[taskId]; if(!t) throw new Error("TASK_NOT_FOUND");
    if(t.STATUS!=="FAILED") throw new Error("ONLY_FAILED_IS_RETRYABLE");
    const before=t.STATE_VERSION;t.STATUS="QUEUED";t.EXECUTION.GENERATION_RESULT=null;
    t.ERROR={ERROR_CODE:null,ERROR_MESSAGE:null};t.STATE_VERSION++;t.UPDATED_AT=this.now();
    this.event("RETRY_QUEUED",t,{before,after:t.STATE_VERSION});this.persist();return this.task(taskId);
  }

  setCircuit(moduleId,open){this.store.circuit[moduleId]=open?"OPEN":"CLOSED";this.persist();}
  canClaim(moduleId){return this.store.circuit[moduleId]!=="OPEN";}
}
