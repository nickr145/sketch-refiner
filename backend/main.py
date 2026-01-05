from fastapi import FastAPI
from models import RefineRequest, RefineResponse
from refine.echo import refine_image
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/refine", response_model=RefineResponse)
def refine(req: RefineRequest):
    refined = refine_image(
        req.image_base64,
        req.constraints
    )

    return RefineResponse(image_base64=refined)
