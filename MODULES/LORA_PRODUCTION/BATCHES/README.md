# LoRA Batches

Create batches only after LORA_PRODUCTION is explicitly activated.

Use current IDs such as:
LORA_BATCH_001

Each batch owns its own design/task records, queue/state, target, counters, and recovery state.

A batch cannot activate the parent module.
