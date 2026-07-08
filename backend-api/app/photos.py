import os
import shutil
from uuid import uuid4
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import SessionLocal
from app.models import Upload

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# Creates and closes a database session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/upload-photo")
async def upload_photo(
    photo: UploadFile = File(...),
    latitude: str = Form(None),
    longitude: str = Form(None),
    timestamp: str = Form(None),
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        file_extension = os.path.splitext(photo.filename)[1]
        safe_filename = f"{uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, safe_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)

        upload_record = Upload(
            user_email=current_user,
            filename=safe_filename,
            latitude=float(latitude) if latitude else None,
            longitude=float(longitude) if longitude else None,
            timestamp=timestamp,
            bortle_prediction=None,
        )

        db.add(upload_record)
        db.commit()
        db.refresh(upload_record)

        return {
            "message": "Photo uploaded and saved successfully",
            "upload_id": upload_record.id,
            "filename": upload_record.filename,
            "file_path": file_path,
            "user_email": upload_record.user_email,
            "latitude": upload_record.latitude,
            "longitude": upload_record.longitude,
            "timestamp": upload_record.timestamp,
            "bortle_prediction": upload_record.bortle_prediction,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))