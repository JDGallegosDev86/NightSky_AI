from fastapi import FastAPI, UploadFile, File, Form
# from app.users import router as user_router
import torch
from torchvision import transforms
from PIL import Image
import io
import sys
import os
import httpx
import asyncio

# --- 1. Path Injection (Allows API to see the model file) ---
script_dir = os.path.dirname(os.path.abspath(__file__))
training_dir = os.path.join(script_dir, 'ai-model', 'training')
sys.path.insert(0, training_dir)

from model import BortleNet

# --- 2. App Initialization & Teammate's Routers ---
app = FastAPI(title="NightSky AI API")

# Connects user endpoints
# app.include_router(user_router)

# --- 3. ML Model Initialization (Runs once on startup) ---
print("Booting up BortleNet Engine...")
model = BortleNet()
model.load_state_dict(torch.load(os.path.join(training_dir, 'bortlenet_weights.pth'), weights_only=True))
model.eval()

image_transforms = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# --- 4. NASA API Helper Function ---
async def get_black_marble_radiance(lat: float, lon: float):
    # Replace with the actual NASA Black Marble API endpoint and token
    nasa_api_url = f"https://example.nasa.gov/blackmarble?lat={lat}&lon={lon}"
    headers = {"Authorization": "Bearer YOUR_NASA_EARTHDATA_TOKEN"}
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(nasa_api_url, headers=headers, timeout=5.0)
            if response.status_code == 200:
                data = response.json()
                return data.get("radiance_value", "Data unavailable")
            else:
                return f"NASA API Error: {response.status_code}"
    except Exception as e:
        return f"Connection Failed: {str(e)}"

# --- 5. Endpoints ---


@app.get("/")
def home():
    return {"message": "NightSky AI backend running"}

# new dual-pipeline prediction route
@app.post("/predict")
async def predict_sky(
    file: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...)
):
    # Start the NASA API call in the background immediately
    nasa_task = asyncio.create_task(get_black_marble_radiance(latitude, longitude))

    # Process the image through BortleNet
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = image_transforms(image).unsqueeze(0)
    
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        confidence, predicted_idx = torch.max(probabilities, 1)
    
    bortle_class = predicted_idx.item() + 1
    
    # Wait for the NASA API to finish its response
    satellite_radiance = await nasa_task
    
    # Return the combined data to the frontend
    return {
        "status": "success",
        "location": {"lat": latitude, "lon": longitude},
        "ground_prediction": {
            "predicted_bortle_class": f"Bortle_{bortle_class}",
            "confidence_score": round(confidence.item() * 100, 2)
        },
        "satellite_data": {
            "black_marble_radiance": satellite_radiance
        }
    }