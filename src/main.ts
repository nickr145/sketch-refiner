import { initCanvas } from "./canvas/Canvas";
import { exportPNG } from "./canvas/export";
import { type Stroke } from "./canvas/Stroke";
import { readFileAsBase64 } from "./upload/upload";
import { buildPayload } from "./api/client";
import { analyzeDrawing } from "./analysis/drawingAnalysis";

const canvasEl = document.getElementById("canvas") as HTMLCanvasElement;
const clearBtn = document.getElementById("clear") as HTMLButtonElement;
const exportBtn = document.getElementById("export") as HTMLButtonElement;
const uploadInput = document.getElementById("upload") as HTMLInputElement;

let strokes: Stroke[] = [];
let uploadRaster: string | null = null;

const canvas = initCanvas(canvasEl, strokes);

clearBtn.onclick = () => {
  canvas.clear();
  strokes.length = 0;
  uploadRaster = null;
};

uploadInput.onchange = async () => {
  if (!uploadInput.files?.[0]) return;
  uploadRaster = await readFileAsBase64(uploadInput.files[0]);
  canvas.clear();
  strokes.length = 0;
};

exportBtn.onclick = () => {
  const raster = uploadRaster ?? exportPNG(canvas);
  const source = uploadRaster ? "upload" : "draw";

  const payload = buildPayload(
    source,
    raster,
    source === "draw" ? strokes : null,
    canvasEl.width,
    canvasEl.height
  );

  console.log("Payload:", payload);
  const metrics = analyzeDrawing(strokes, canvas.width, canvas.height);
  console.log("Metrics:", metrics);
};

// DEBUG — leave this in temporarily
console.log("Drawing mode:", canvas.isDrawingMode);
console.log("Strokes array:", strokes);