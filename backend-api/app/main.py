from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.users import router as user_router
from app.photos import router as photo_router
from app.database import Base, engine
from app import models
from app.models import Base

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://192.168.1.229:8000",
        "http://192.168.1.229:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(photo_router)


@app.get("/")
def home():
    return {"message": "NightSky AI backend running"}