export function strokeLength(points: [number, number][]): number {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    len += Math.hypot(x2 - x1, y2 - y1);
  }
  return len;
}

export function boundingBox(points: [number, number][]) {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  for (const [x, y] of points) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  return { minX, minY, maxX, maxY };
}

export function averageCurvature(points: [number, number][]): number {
  if (points.length < 3) return 0;

  let total = 0;
  let count = 0;

  for (let i = 1; i < points.length - 1; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];

    const a = Math.hypot(x1 - x0, y1 - y0);
    const b = Math.hypot(x2 - x1, y2 - y1);
    const c = Math.hypot(x2 - x0, y2 - y0);

    if (a * b === 0) continue;

    const cosTheta = (a * a + b * b - c * c) / (2 * a * b);
    total += Math.acos(Math.min(1, Math.max(-1, cosTheta)));
    count++;
  }

  return count ? total / count : 0;
}

export function roughness(points: [number, number][]): number {
  if (points.length < 3) return 0;

  let total = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];

    const dx1 = x1 - x0;
    const dy1 = y1 - y0;
    const dx2 = x2 - x1;
    const dy2 = y2 - y1;

    const mag1 = Math.hypot(dx1, dy1);
    const mag2 = Math.hypot(dx2, dy2);
    if (mag1 * mag2 === 0) continue;

    const dot = dx1 * dx2 + dy1 * dy2;
    total += 1 - dot / (mag1 * mag2);
  }

  return total / (points.length - 2);
}
