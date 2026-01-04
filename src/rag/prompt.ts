import { type Rule } from "./rules";
import { type RefinementConstraints } from "./constraints";

export function buildPrompt(
  constraints: RefinementConstraints,
  rules: Rule[]
): string {

  return `
You are refining an existing 2D sketch.

Rules:
- Do not add new objects
- Do not change composition
- Do not add shading or texture

Constraints:
${Object.entries(constraints)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}

Refinement Rules:
${rules.map(r => `- ${r.content}`).join("\n")}

Task:
Clean and refine the provided sketch while preserving its original intent exactly.
`;
}
