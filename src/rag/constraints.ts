import { type DrawingMetrics } from "../analysis/types";

const ROUGHNESS_THRESHOLD = 0.02;
const SYMMETRY_THRESHOLD = 0.6;
const DENSITY_THRESHOLD = 0.003;

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
    smoothLines: metrics.avgRoughness > ROUGHNESS_THRESHOLD,
    preserveSymmetry: metrics.symmetryScore > SYMMETRY_THRESHOLD,
    avoidOverprocessing: metrics.density < DENSITY_THRESHOLD,
    protectIntersections: metrics.intersections > 0,
  };
}
