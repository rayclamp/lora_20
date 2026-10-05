# START_HERE.md

Simple image-production reference and persistence database.

Production commands explicitly supply the repository and required paths/settings.

GitHub stores:
- character references
- drawing/anatomy rules
- wallpaper/festival/LoRA references
- QA references
- automated-production records and checkpoints required for interruption recovery

GitHub does **not** control runtime, Worker lifecycle, queues, scheduling, prompt gates, retries, or orchestration.

Worker flow:

**Manual**
`read requested references → design image → write Prompt → return Prompt`

**Automated**
`read requested references → design image → write Prompt → execute same Prompt → persist production information/checkpoint`

Manual and automated production use the same design process. Automated mode adds execution and durable persistence so interrupted production can continue without losing completed work.
