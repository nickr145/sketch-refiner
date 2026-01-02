import * as fabric from "fabric";

export function exportPNG(canvas: fabric.Canvas): string {
  return canvas.toDataURL({
    format: "png",
    multiplier: 2,
  });
}
