import os
import shutil
from fastapi import APIRouter, UploadFile, File, Form

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload-photo")
async def upload_photo(
    photo: UploadFile = File(...),
    latitude: str = Form(None),
    longitude: str = Form(None),
    timestamp: str = Form(None),
):
    file_path = os.path.join(UPLOAD_DIR, photo.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(photo.file, buffer)

    return {
        "message": "Photo uploaded successfully",
        "filename": photo.filename,
        "latitude": latitude,
        "longitude": longitude,
        "timestamp": timestamp,
    }