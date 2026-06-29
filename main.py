from fastapi import FastAPI, UploadFile, File, Form
# from app.users import router as user_router
import torch
from torchvision import transforms
from PIL import Image
import io
import sys
import os
from dotenv import load_dotenv
import httpx
import asyncio

# Loads our hidden API keys. Guys, make sure you create a .env file locally!
load_dotenv()

# 1. Pathing fix (Forces the API to look in the right folder so it can find our model)
script_dir = os.path.dirname(os.path.abspath(__file__))
training_dir = os.path.join(script_dir, 'ai-model', 'training')
sys.path.insert(0, training_dir)

from model import BortleNet

# 2. App setup. (Note: I commented out the user router until we merge our branches so it doesn't crash my local testing!)
app = FastAPI(title="NightSky AI API")
# app.include_router(user_router)


# 3. Load BortleNet (Warning: this takes a sec on startup, just let it load)
print("Booting up BortleNet Engine...")
model = BortleNet()
model.load_state_dict(torch.load(os.path.join(training_dir, 'bortlenet_weights.pth'), weights_only=True))
model.eval()

# Forces all uploaded images to be exactly 128x128 so the CNN doesn't freak out
image_transforms = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])


# 4. NASA API - The fix! Bypassed the broken python library and hitting their REST API directly.
async def get_black_marble_radiance(lat: float, lon: float):
    # This hits a real NASA Earthdata composite to extract the exact pixel radiance for our coordinates.
    nasa_api_url = "https://gis.earthdata.nasa.gov/gis05/rest/services/DISASTERS_202601_WINTERWX_US/202601_BlackMarble_BRDF/ImageServer/identify"
    
    params = {
        "geometry": f"{lon},{lat}",
        "geometryType": "esriGeometryPoint",
        "returnGeometry": "false",
        "f": "json"
    }
    
    try:
        # Native async request so we don't block the ML model from running at the same time
        async with httpx.AsyncClient() as client:
            response = await client.get(nasa_api_url, params=params, timeout=10.0)
            
            if response.status_code == 200:
                data = response.json()
                
                # Digging the raw pixel value out of the massive JSON response they send back
                pixel_value = data.get("value", "NoData")
                
                # If NASA's satellite was blocked by clouds, it returns "NoData"
                if pixel_value == "NoData" or pixel_value == "":
                    return "Cloud cover / No valid reading"
                    
                return round(float(pixel_value), 2)
            else:
                return f"NASA Server Error: {response.status_code}"
    except Exception as e:
        return f"HTTP Request Failed: {str(e)}"


# 5. Endpoints (Frontend team, this is for you!)

@app.get("/")
def home():
    return {"message": "NightSky AI backend running"}


# This is the main dual-pipeline. Send it an image + GPS coordinates!
@app.post("/predict")
async def predict_sky(
    file: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...)
):
    # Fire off the NASA network request in the background immediately
    nasa_task = asyncio.create_task(get_black_marble_radiance(latitude, longitude))

    # While NASA is thinking, process the image through our PyTorch model locally
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = image_transforms(image).unsqueeze(0)
    
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        confidence, predicted_idx = torch.max(probabilities, 1)
    
    bortle_class = predicted_idx.item() + 1
    
    # Wait for the NASA API to finish its background task
    satellite_radiance = await nasa_task
    
    # Bundle both the ground prediction and the satellite data into one JSON package
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