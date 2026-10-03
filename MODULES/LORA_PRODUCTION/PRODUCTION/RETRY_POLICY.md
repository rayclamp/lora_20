# LoRA Retry Policy

## Per-task
A genuine generation-tool failure may retry up to 3 attempts unless a stricter current Goal limit exists.

UNKNOWN is not a retry signal. UNKNOWN requires recovery.

## Circuit breaker
Three consecutive genuine generation-tool errors pause new generation claims.

A successful IMAGE_CREATED resets the consecutive error counter.

## Safety block
SAFETY_BLOCKED is not a generation-tool error. Never rewrite prompts to bypass a safety restriction.
