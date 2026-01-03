import * as fabric from "fabric";
import { type Stroke } from "./Stroke";
import { v4 as uuid } from "uuid";

export function initCanvas(
  el: HTMLCanvasElement,
  strokes: Stroke[],
  onStrokeAdded?: () => void
): fabric.Canvas {

  const canvas = new fabric.Canvas(el);
  canvas.isDrawingMode = true;

  const brush = new fabric.PencilBrush(canvas);
  brush.width = 4;
  brush.color = "#000";
  canvas.freeDrawingBrush = brush;

  canvas.on("path:created", (e: any) => {
  const path = (e.path ?? e.target) as fabric.Path | undefined;
  if (!path) return;

  const points = (path.path as any[])
    .filter(p => p[0] === "M" || p[0] === "L")
    .map(p => [p[1], p[2]] as [number, number]);

  strokes.push({
    id: uuid(),
    points,
    width: brush.width,
    color: brush.color,
  });

  onStrokeAdded?.();

  console.log("Stroke added. Total:", strokes.length);
});


  return canvas;
}
