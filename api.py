
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from model import predict_risk


app = FastAPI()


# Allow HTML/JavaScript to communicate
# with Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def home():

    return {
        "message": "Landslide API is running"
    }


@app.post("/predict")
def predict(data: dict):

    latitude = data["latitude"]
    longitude = data["longitude"]

    # Send coordinates to ML model
    risk, confidence = predict_risk(
        latitude,
        longitude
    )

    # Send result back to JavaScript
    return {
        "latitude": latitude,
        "longitude": longitude,
        "risk": risk,
        "confidence": round(confidence, 2),

        # Demo environmental values
        "rainfall": 85,
        "elevation": 620,
        "slope": 28,
        "vegetation": "Moderate",
        "soil": "Clay Loam"
    }