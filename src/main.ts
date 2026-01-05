import { initCanvas } from "./canvas/Canvas";
import { exportPNG } from "./canvas/export";
import { type Stroke } from "./canvas/Stroke";
import { readFileAsBase64 } from "./upload/upload";
import { buildPayload } from "./api/client";
import { analyzeDrawing } from "./analysis/drawingAnalysis";
import { countIntersections } from "./analysis/intersections";
import { verticalSymmetryScore } from "./analysis/symmetry";
import { groupStrokes } from "./analysis/grouping";
import { deriveConstraints } from "./rag/constraints";
import { retrieveRules } from "./rag/retriever";
import { buildPrompt } from "./rag/prompt";
import { refineImage } from "./api/refine";

const canvasEl = document.getElementById("canvas") as HTMLCanvasElement;
const clearBtn = document.getElementById("clear") as HTMLButtonElement;
const exportBtn = document.getElementById("export") as HTMLButtonElement;
const uploadInput = document.getElementById("upload") as HTMLInputElement;

function recomputeMetrics() {
  // Phase 3
  const drawingMetrics = analyzeDrawing(strokes, canvas.width, canvas.height);

  // Phase 4
  const intersections = countIntersections(strokes);
  const symmetry = verticalSymmetryScore(strokes, canvas.width);
  const groups = groupStrokes(strokes);

  // Phase 5 — Constraints
  currentConstraints = deriveConstraints({
    ...drawingMetrics,
    intersections,
    symmetryScore: symmetry,
  });

  // Phase 5 — RAG retrieval
  const rules = retrieveRules(currentConstraints);

  // Phase 5 — Prompt assembly
  currentPrompt = buildPrompt(currentConstraints, rules);

  // Debug output (temporary)
  console.log("Drawing metrics:", drawingMetrics);
  console.log("Intersections:", intersections);
  console.log("Vertical symmetry:", symmetry);
  console.log(
    "Groups:",
    groups.map((g) => g.length)
  );

  console.log("Constraints:", currentConstraints);
  console.log(
    "Retrieved rules:",
    rules.map((r) => r.id)
  );
  console.log("Prompt:\n", currentPrompt);
}

let strokes: Stroke[] = [];
let uploadRaster: string | null = null;
let currentConstraints: any = null;
let currentPrompt: string = "";
let outputImg: HTMLImageElement | null = null;

const canvas = initCanvas(canvasEl, strokes, recomputeMetrics);

clearBtn.onclick = () => {
  canvas.clear();
  strokes.length = 0;
  uploadRaster = null;
  recomputeMetrics();
};

uploadInput.onchange = async () => {
  if (!uploadInput.files?.[0]) return;
  uploadRaster = await readFileAsBase64(uploadInput.files[0]);
  canvas.clear();
  strokes.length = 0;
  recomputeMetrics();
};

exportBtn.onclick = async () => {
  const raster = uploadRaster ?? exportPNG(canvas);

  if (!currentPrompt || !currentConstraints) {
    console.warn("No prompt or constraints available");
    return;
  }

  const refined = await refineImage(raster, currentPrompt, currentConstraints);

  console.log("Refined image:", refined);

  // Optional: display result
  if (!outputImg) {
    outputImg = new Image();
    outputImg.style.maxWidth = "400px";
    outputImg.style.border = "1px solid #ccc";
    outputImg.style.display = "block";
    outputImg.style.marginTop = "16px";
    document.body.appendChild(outputImg);
  }

  outputImg.src = refined;
};

// DEBUG — leave this in temporarily
console.log("Drawing mode:", canvas.isDrawingMode);
console.log("Strokes array:", strokes);
