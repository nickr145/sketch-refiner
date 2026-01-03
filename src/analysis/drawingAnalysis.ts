import { type Stroke } from "../canvas/Stroke";
import { type DrawingMetrics } from "./types";
import { analyzeStroke } from "./strokeAnalysis";

export function analyzeDrawing(
  strokes: Stroke[],
  canvasWidth: number,
  canvasHeight: number
): DrawingMetrics {

  const strokeMetrics = strokes.map(analyzeStroke);

  const totalLength = strokeMetrics.reduce(
    (sum, s) => sum + s.length,
    0
  );

  const avgRoughness =
    strokeMetrics.length === 0
      ? 0
      : strokeMetrics.reduce((s, m) => s + m.roughness, 0) /
        strokeMetrics.length;

  const canvasArea = canvasWidth * canvasHeight;

  return {
    strokeCount: strokes.length,
    totalLength,
    avgRoughness,
    density: canvasArea ? totalLength / canvasArea : 0,
  };
}
