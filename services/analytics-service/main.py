
from fastapi import FastAPI

app = FastAPI()

# Temporary click storage
clicks = {}


# Home route
@app.get("/")
def home():
    return {
        "message": "Analytics Service is running!"
    }


# Record a click
@app.post("/api/analytics/click/{short_code}")
def record_click(short_code: str):

    if short_code not in clicks:
        clicks[short_code] = 0

    clicks[short_code] += 1

    return {
        "shortCode": short_code,
        "totalClicks": clicks[short_code],
        "message": "Click recorded successfully"
    }


# Get click statistics
@app.get("/api/analytics/{short_code}")
def get_analytics(short_code: str):

    total = clicks.get(short_code, 0)

    return {
        "shortCode": short_code,
        "totalClicks": total
    }
