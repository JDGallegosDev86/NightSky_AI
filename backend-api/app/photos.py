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
            shared_publicly=(sharePublicly == "true"),
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


@router.get("/my-uploads")
def get_my_uploads(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    uploads = (
        db.query(Upload)
        .filter(Upload.user_email == current_user)
        .order_by(Upload.id.desc())
        .all()
    )

    return [
        {
            "id": upload.id,
            "filename": upload.filename,
            "image_url": f"/uploads/{upload.filename}",
            "latitude": upload.latitude,
            "longitude": upload.longitude,
            "timestamp": upload.timestamp,
            "bortle_prediction": upload.bortle_prediction,
        }
        for upload in uploads
    ]


@router.get("/public-uploads")
def get_public_uploads(db: Session = Depends(get_db)):
    # Deliberately omits user_email from both the query filtering
    # and the response — this endpoint powers the public map, and
    # no uploader identity should ever be attached to a pin that
    # isn't the current user's own.
    uploads = (
        db.query(Upload)
        .filter(Upload.shared_publicly == True)
        .filter(Upload.latitude.isnot(None))
        .filter(Upload.longitude.isnot(None))
        .all()
    )

    return [
        {
            "id": upload.id,
            "latitude": upload.latitude,
            "longitude": upload.longitude,
            "bortle_prediction": upload.bortle_prediction,
            "timestamp": upload.timestamp,
        }
        for upload in uploads
    ]


@router.delete("/uploads/{upload_id}")
def delete_upload(
    upload_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    upload = db.query(Upload).filter(Upload.id == upload_id).first()

    if upload is None:
        raise HTTPException(status_code=404, detail="Upload not found")

    # Ownership check — prevents a user from deleting someone else's
    # upload by simply guessing or incrementing an ID number.
    if upload.user_email != current_user:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to delete this upload",
        )

    # Remove the actual image file from disk, if it still exists
    file_path = os.path.join(UPLOAD_DIR, upload.filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    # Remove the database row
    db.delete(upload)
    db.commit()

    return {"message": "Upload deleted successfully"}