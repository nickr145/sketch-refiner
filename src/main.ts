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


const canvasEl = document.getElementById("canvas") as HTMLCanvasElement;
const clearBtn = document.getElementById("clear") as HTMLButtonElement;
const exportBtn = document.getElementById("export") as HTMLButtonElement;
const uploadInput = document.getElementById("upload") as HTMLInputElement;

function recomputeMetrics() {
  // Phase 3
  const drawingMetrics = analyzeDrawing(
    strokes,
    canvas.width,
    canvas.height
  );

  // Phase 4
  const intersections = countIntersections(strokes);
  const symmetry = verticalSymmetryScore(strokes, canvas.width);
  const groups = groupStrokes(strokes);

  // Phase 5 — Constraints
  const constraints = deriveConstraints({
    ...drawingMetrics,
    intersections,
    symmetryScore: symmetry,
  });

  // Phase 5 — RAG retrieval
  const rules = retrieveRules(constraints);

  // Phase 5 — Prompt assembly
  const prompt = buildPrompt(constraints, rules);

  // Debug output (temporary)
  console.log("Drawing metrics:", drawingMetrics);
  console.log("Intersections:", intersections);
  console.log("Vertical symmetry:", symmetry);
  console.log("Groups:", groups.map(g => g.length));

  console.log("Constraints:", constraints);
  console.log("Retrieved rules:", rules.map(r => r.id));
  console.log("Prompt:\n", prompt);
}


let strokes: Stroke[] = [];
let uploadRaster: string | null = null;

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
};

// DEBUG — leave this in temporarily
console.log("Drawing mode:", canvas.isDrawingMode);
console.log("Strokes array:", strokes);
