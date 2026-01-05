from pydantic import BaseModel
from typing import Dict, Any

class RefineRequest(BaseModel):
    image_base64: str
    prompt: str
    constraints: Dict[str, Any]

class RefineResponse(BaseModel):
    image_base64: str
