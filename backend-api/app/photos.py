import os
import shutil
from uuid import uuid4
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from app.auth import get_current_user

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload-photo")
async def upload_photo(
    photo: UploadFile = File(...),
    latitude: str = Form(None),
    longitude: str = Form(None),
    timestamp: str = Form(None),
    current_user: str = Depends(get_current_user),
):
    try:
        file_extension = os.path.splitext(photo.filename)[1]
        safe_filename = f"{uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, safe_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)

        return {
            "message": "Photo uploaded successfully",
            "uploaded_by": current_user,
            "filename": safe_filename,
            "file_path": file_path,
            "latitude": latitude,
            "longitude": longitude,
            "timestamp": timestamp,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Photo upload failed: {str(error)}"
        )