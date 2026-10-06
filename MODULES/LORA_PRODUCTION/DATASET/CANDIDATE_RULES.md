# LoRA Candidate Rules

Prefer candidates with:
- clear identity evidence;
- readable hair;
- natural body proportions;
- stable hands/feet;
- meaningful pose/action variation;
- useful clothing variation;
- deliberate framing variation.

Avoid:
- unnecessary mirror/reflection dual instances;
- unstable hand interactions;
- excessive occlusion;
- decorative effects around fingers/toes;
- accidental animals/pets;
- extreme perspective that makes proportions unreliable;
- redundant near-duplicates.

If a complex visual idea does not materially improve dataset coverage, choose the simpler stable design.

## Mirror / reflection dataset conflict

Even when the mirror character and real-world character each appear individually plausible, reject the candidate from the LoRA dataset if their poses or actions are inconsistent and create conflicting pose evidence. Prevent this risk during LoRA task design instead of relying on downstream QA to rescue the candidate.
