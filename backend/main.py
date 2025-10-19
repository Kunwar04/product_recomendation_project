from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Union
import json
from backend.db.vector_utils import initialize_ai_services, get_recommendations

# --- Initialization ---
app = FastAPI(title="AI Furniture Recommender Backend")
initialize_ai_services() # Initialize models and Pinecone connection

# --- CORS Configuration (Essential for React to talk to FastAPI) ---
origins = [
    "http://localhost:3000",  # Default React development port
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mock Analytics Data (Should come from data_analytics.ipynb results) ---
# Replace this with real data persistence/loading if using a separate DB
MOCK_ANALYTICS_DATA = {
    "total_products": 1024,
    "top_categories": [
        {"name": "Home & Kitchen", "count": 450},
        {"name": "Office Furniture", "count": 250},
        {"name": "Patio & Garden", "count": 150},
    ],
    "avg_price_by_material": {
        "Wood": 450.99,
        "Metal": 210.50,
        "Fabric": 680.20,
        "Engineered Wood": 120.00
    },
    "brand_distribution": [
        {"brand": "Modway Store", "count": 55},
        {"brand": "GOYMFK", "count": 40},
        {"brand": "Noori Rug", "count": 30},
    ]
}

# --- 1. Recommendation Endpoint (ML, NLP, GenAI) ---
@app.post("/api/recommend", response_model=List[Dict])
async def recommend_products(query: Dict[str, str]):
    """
    Handles the recommendation conversation.
    1. Embeds prompt. 2. Searches Pinecone. 3. Generates descriptions.
    """
    user_prompt = query.get("prompt")
    if not user_prompt:
        raise HTTPException(status_code=400, detail="Prompt is required for recommendation.")

    print(f"Processing recommendation request for: {user_prompt}")
    
    # Call the core recommendation logic
    recommendations = get_recommendations(user_prompt, top_k=5)
    
    if not recommendations:
        # Provide a graceful fallback if the vector index is empty or disconnected
        return [
            {"title": "Fallback Sofa", "price": "999.99", "image_url": "https://placehold.co/400x300/CCCCCC/000000?text=AI+Offline", "creative_description": "Our systems are temporarily offline, but we still recommend comfort."}
        ]

    return recommendations

# --- 2. Analytics Endpoint ---
@app.get("/api/analytics", response_model=Dict)
async def get_analytics_data():
    """
    Returns aggregated analytics data for the dashboard.
    """
    # In a production app, this would query a dedicated analytics database.
    return MOCK_ANALYTICS_DATA

# --- Root Endpoint (Health Check) ---
@app.get("/")
def read_root():
    return {"status": "AI Recommender Backend is operational."}