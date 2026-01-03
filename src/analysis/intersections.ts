import { type Stroke } from "../canvas/Stroke";

type Segment = [[number, number], [number, number]];

function segments(points: [number, number][]): Segment[] {
  const segs: Segment[] = [];
  for (let i = 1; i < points.length; i++) {
    segs.push([points[i - 1], points[i]]);
  }
  return segs;
}

function intersects(a: Segment, b: Segment): boolean {
  const [[x1, y1], [x2, y2]] = a;
  const [[x3, y3], [x4, y4]] = b;

  const d =
    (x1 - x2) * (y3 - y4) -
    (y1 - y2) * (x3 - x4);

  if (d === 0) return false;

  const t =
    ((x1 - x3) * (y3 - y4) -
      (y1 - y3) * (x3 - x4)) / d;

  const u =
    ((x1 - x3) * (y1 - y2) -
      (y1 - y3) * (x1 - x2)) / d;

  return t > 0 && t < 1 && u > 0 && u < 1;
}

export function countIntersections(strokes: Stroke[]): number {
  let count = 0;

  for (let i = 0; i < strokes.length; i++) {
    for (let j = i + 1; j < strokes.length; j++) {
      const segsA = segments(strokes[i].points);
      const segsB = segments(strokes[j].points);

      for (const a of segsA) {
        for (const b of segsB) {
          if (intersects(a, b)) {
            count++;
            break;
          }
        }
      }
    }
  }

  return count;
}
