from fastapi import FastAPI
from app.users import router as user_router

app = FastAPI()

app.include_router(user_router)


@app.get("/")
def home():
    return {"message": "NightSky AI backend running"}