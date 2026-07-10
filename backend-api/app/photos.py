import os
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import SessionLocal
from app.models import Upload
from app.bortle_analyzer import analyze_image

router = APIRouter()

# ── Upload directory ─────────────────────────────────────
# All uploaded photos are saved here.
# TODO: Replace with cloud storage (AWS S3, etc.) in production.
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
    sharePublicly: str = Form(None),
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        # ── Read the image bytes ─────────────────────────
        image_bytes = await photo.read()

        # ── Save the file to disk ────────────────────────
        file_extension = os.path.splitext(photo.filename)[1]
        safe_filename = f"{uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, safe_filename)

        with open(file_path, "wb") as buffer:
            buffer.write(image_bytes)

        # ── Run Bortle analysis ──────────────────────────
        # Pass the raw image bytes to the math analyzer.
        # This returns the Bortle level and supporting metrics.
        analysis_result = analyze_image(image_bytes)

        bortle_prediction = None
        if analysis_result.get("success"):
            bortle_prediction = str(analysis_result.get("bortle_level"))

        upload_record = Upload(
            user_email=current_user,
            filename=safe_filename,
            latitude=float(latitude) if latitude else None,
            longitude=float(longitude) if longitude else None,
            timestamp=timestamp,
            bortle_prediction=bortle_prediction,
        )

        db.add(upload_record)
        db.commit()
        db.refresh(upload_record)

        # ── Build the response ───────────────────────────
        if analysis_result.get("success"):
            return {
                "message": "Photo uploaded, analyzed, and saved successfully",
                "upload_id": upload_record.id,
                "filename": upload_record.filename,
                "file_path": file_path,
                "user_email": upload_record.user_email,
                "latitude": upload_record.latitude,
                "longitude": upload_record.longitude,
                "timestamp": upload_record.timestamp,
                "sharePublicly": sharePublicly,
                "bortle_prediction": upload_record.bortle_prediction,
                "bortle_level": analysis_result.get("bortle_level"),
                "confidence": analysis_result.get("confidence"),
                "sqm_estimate": analysis_result.get("sqm_estimate"),
                "analysis": analysis_result.get("analysis"),
                "pipeline": analysis_result.get("pipeline"),
            }

        # Analysis failed but file was still saved
        return {
            "message": "Photo uploaded and saved, but analysis failed",
            "upload_id": upload_record.id,
            "filename": upload_record.filename,
            "file_path": file_path,
            "user_email": upload_record.user_email,
            "latitude": upload_record.latitude,
            "longitude": upload_record.longitude,
            "timestamp": upload_record.timestamp,
            "sharePublicly": sharePublicly,
            "bortle_prediction": upload_record.bortle_prediction,
            "error": analysis_result.get("error", "Unknown error"),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))