# START_HERE.md

Simple image-production reference and persistence database.

Production commands explicitly supply the repository and required paths/settings.

## 0. Mandatory GitHub Connection Gate — NON-NEGOTIABLE

Automated production MUST actively connect to the current GitHub repository and successfully read the authoritative data required for the current stage. Mentioning GitHub, recalling previously read content, or relying on cached/stale context does NOT count as a successful connection.

The Producer MUST perform a fresh GitHub connection/read-and-verify gate at each of these boundaries:

1. **Session startup, before any production planning:** read this entry document, the current canonical path registry, CORE rules, and the applicable generation worker protocol.
2. **Before task/prompt design:** reconnect and read the current module, production-type, character/reference, and other applicable design rules.
3. **Before locking or selecting a prompt for generation:** reconnect and read the current Session/Batch, Task Queue, and authoritative locked Prompt Set; verify the exact Task and prompt/version.
4. **Immediately before every image-generation call:** reconnect and read/verify the current Task state and exact locked prompt. Bind that exact readback through EXACT_BINDING into GENERATION_INPUT_FROZEN. Do not send the user's startup command, Production Request, task list, or a summary as a substitute for the locked prompt.
5. **After a generation result, before recording it:** reconnect and read the current authoritative record state; then persist the actual result, output count, call/result identity, and verification state; read back the write to verify it.
6. **On interruption, stop, or resume:** reconnect first; read the current Session/Batch, all required batch records, latest execution log, and checkpoint; classify and persist the actual interruption state; verify the write before continuing or reporting recovery state.
7. **Before moving to the next Task and before declaring completion:** reconnect, read the latest authoritative state, verify the preceding write, and only then select the next Task or determine completion.

A connection/read/write verification from an earlier stage MUST NOT be reused as proof for a later stage. Each gate must be completed at the point specified above.

### Fail-Closed Rule

If GitHub cannot be reached, required files cannot be read, current state cannot be verified, a required write fails, or the write cannot be read back and verified:

- STOP the current production workflow immediately.
- Do NOT design from memory, cached context, stale records, or guesses.
- Do NOT create or substitute a prompt from the startup command or Production Request.
- Do NOT call the image-generation interface.
- Do NOT reinterpret, reconstruct, summarize, translate, reorder, add to, remove from, or otherwise transform a locked prompt after EXACT_READBACK and before GENERATION_CALL.
- Do NOT advance to another Task or claim the Batch is complete.
- If possible, persist a precise blocked/error event to GitHub. If GitHub itself is unavailable and that event cannot be persisted, report `GITHUB_RECORDING_FAILED` and explicitly state that the authoritative record could not be updated.
- Continue only after GitHub access and the required current state are successfully re-verified.

These are mandatory Producer Runtime gates, not advisory reminders. A successful previous read, a planned connection, or a textual claim that GitHub was read is insufficient.

## 1. Repository Role

GitHub stores:
- character references
- drawing/anatomy rules
- wallpaper/festival/LoRA references
- QA references
- automated-production records and checkpoints required for interruption recovery

GitHub is the authoritative reference and persistence database. It does **not** independently control runtime, Worker lifecycle, queues, scheduling, retries, or orchestration. This boundary does not weaken the mandatory per-stage GitHub connection, read, write, and verification gates above.

## 2. Worker Flow

**Manual**
`read requested references → design image → write Prompt → return Prompt`

**Automated**
`connect/read/verify GitHub → read applicable references → design prompt → reconnect/read/verify current task state → persist and lock prompt → reconnect/read/verify locked prompt → exact-bind and freeze that exact prompt → execute that exact frozen prompt once → reconnect/read current record state → persist result/checkpoint → read back and verify write → reconnect before next step`

Manual and automated production use the same design process. Automated mode adds execution and durable persistence so interrupted production can continue without losing completed work.

## 3. Required Protocol

Before any /START_AUTO generation, the Producer MUST read and obey:
- `00_MASTER/CANONICAL_PATH_REGISTRY.md`
- `00_MASTER/CORE_RULES.md`
- `00_MASTER/GENERATION_WORKER_PROTOCOL.md`
- the applicable module and production-type rules
- the applicable current Session/Batch records when resuming

The detailed step gate is defined in `00_MASTER/GENERATION_WORKER_PROTOCOL.md`. If any required source is unavailable or unverified, the Entry Gate is BLOCKED and generation is forbidden.
