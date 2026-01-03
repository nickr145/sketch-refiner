export type BoundingBox = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export type StrokeMetrics = {
  strokeId: string;
  length: number;
  avgCurvature: number;
  roughness: number;
  bbox: BoundingBox;
};

export type DrawingMetrics = {
  strokeCount: number;
  totalLength: number;
  avgRoughness: number;
  density: number;
};
