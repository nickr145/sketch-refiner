import { type Stroke } from "../canvas/Stroke";

export type DrawingPayload = {
  source: "draw" | "upload";
  strokes: Stroke[] | null;
  raster: string;
  canvas: {
    width: number;
    height: number;
  };
};

export function buildPayload(
  source: "draw" | "upload",
  raster: string,
  strokes: Stroke[] | null,
  width: number,
  height: number
): DrawingPayload {
  return {
    source,
    strokes,
    raster,
    canvas: { width, height },
  };
}
