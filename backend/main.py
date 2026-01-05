from fastapi import FastAPI
from models import RefineRequest, RefineResponse
from refine.echo import refine_image

app = FastAPI()

@app.post("/refine", response_model=RefineResponse)
def refine(req: RefineRequest):
    refined = refine_image(req.image_base64)

    return RefineResponse(
        image_base64=refined
    )
