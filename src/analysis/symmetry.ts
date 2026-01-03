import { type Stroke } from "../canvas/Stroke";

export function verticalSymmetryScore(
  strokes: Stroke[],
  canvasWidth: number
): number {
  if (strokes.length === 0) return 0;

  const midX = canvasWidth / 2;
  let matches = 0;
  let total = 0;

  for (const stroke of strokes) {
    for (const [x] of stroke.points) {
      const mirrored = 2 * midX - x;
      total++;

      for (const other of strokes) {
        if (
          other.points.some(
            ([ox]) => Math.abs(ox - mirrored) < 5
          )
        ) {
          matches++;
          break;
        }
      }
    }
  }

  return matches / total;
}
