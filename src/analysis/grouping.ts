import { type Stroke } from "../canvas/Stroke";
import { analyzeStroke } from "./strokeAnalysis";

export function groupStrokes(
  strokes: Stroke[],
  threshold = 40
): Stroke[][] {
  const groups: Stroke[][] = [];
  const used = new Set<string>();

  for (const stroke of strokes) {
    if (used.has(stroke.id)) continue;

    const group = [stroke];
    used.add(stroke.id);

    const bboxA = analyzeStroke(stroke).bbox;

    for (const other of strokes) {
      if (used.has(other.id)) continue;

      const bboxB = analyzeStroke(other).bbox;

      const close =
        Math.abs(bboxA.minX - bboxB.minX) < threshold &&
        Math.abs(bboxA.minY - bboxB.minY) < threshold;

      if (close) {
        group.push(other);
        used.add(other.id);
      }
    }

    groups.push(group);
  }

  return groups;
}
