import { type Stroke } from "../canvas/Stroke";
import { type StrokeMetrics } from "./types";
import {
  strokeLength,
  boundingBox,
  averageCurvature,
  roughness,
} from "./geometry";

export function analyzeStroke(stroke: Stroke): StrokeMetrics {
  return {
    strokeId: stroke.id,
    length: strokeLength(stroke.points),
    avgCurvature: averageCurvature(stroke.points),
    roughness: roughness(stroke.points),
    bbox: boundingBox(stroke.points),
  };
}
