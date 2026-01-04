import { type Rule } from "./rules";
import { type RefinementConstraints } from "./constraints";

const RULES: Rule[] = [
  {
    id: "preserve-symmetry",
    tags: ["symmetry"],
    content:
      "Preserve existing symmetry. Do not introduce asymmetric changes."
  },
  {
    id: "protect-intersections",
    tags: ["intersections"],
    content:
      "Do not smooth or remove stroke intersections."
  },
  {
    id: "avoid-overprocessing",
    tags: ["light-touch"],
    content:
      "Apply minimal refinement. Preserve original stroke character."
  },
  {
    id: "smooth-lines",
    tags: ["smoothing"],
    content:
      "Apply light stroke smoothing to reduce jitter while preserving shape."
  },
];

export function retrieveRules(
  constraints: RefinementConstraints
): Rule[] {

  return RULES.filter(rule => {
    if (rule.tags.includes("symmetry") && !constraints.preserveSymmetry)
      return false;
    if (rule.tags.includes("intersections") && !constraints.protectIntersections)
      return false;
    if (rule.tags.includes("light-touch") && !constraints.avoidOverprocessing)
      return false;
    if (rule.tags.includes("smoothing") && !constraints.smoothLines)
      return false;

    return true;
  });
}
