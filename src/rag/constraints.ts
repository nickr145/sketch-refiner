import { type DrawingMetrics } from "../analysis/types";

export type RefinementConstraints = {
  smoothLines: boolean;
  preserveSymmetry: boolean;
  avoidOverprocessing: boolean;
  protectIntersections: boolean;
};

export function deriveConstraints(
  metrics: DrawingMetrics & {
    intersections: number;
    symmetryScore: number;
  }
): RefinementConstraints {

  return {
    smoothLines: metrics.avgRoughness > 0.02,
    preserveSymmetry: metrics.symmetryScore > 0.6,
    avoidOverprocessing: metrics.density < 0.003,
    protectIntersections: metrics.intersections > 0,
  };
}
