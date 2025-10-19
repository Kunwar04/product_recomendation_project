import os
import time
import pandas as pd
from pinecone import Pinecone, PodSpec, ServerlessSpec
# Import SentenceTransformer for embedding user queries (NLP)
from sentence_transformers import SentenceTransformer 
# Import LangChain components for GenAI integration
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
# Mock LLM - In a real app, this would be an actual LLM provider (e.g., Ollama, Gemini, OpenAI)
from typing import List, Dict

# --- Configuration (Set these via environment variables or replace placeholders) ---
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "YOUR_PINECONE_API_KEY")
INDEX_NAME = "furniture-recommender"
EMBEDDING_MODEL_NAME = 'all-MiniLM-L6-v2' 
EMBEDDING_DIMENSION = 384 # Dimension for 'all-MiniLM-L6-v2'

# --- Global Model and Index Initializers ---
# These run once when the FastAPI server starts, keeping the models in memory.
recommendation_model = None
pinecone_index = None

def initialize_ai_services():
    """Initializes global Sentence Transformer model and Pinecone connection."""
    global recommendation_model
    global pinecone_index
    
    if recommendation_model is None:
        print("Loading Sentence Transformer model...")
        recommendation_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
        
    if pinecone_index is None:
        print(f"Connecting to Pinecone index: {INDEX_NAME}...")
        try:
            pc = Pinecone(api_key=PINECONE_API_KEY)
            
            # Check if index exists, required for the backend to run
            if INDEX_NAME not in pc.list_indexes().names:
                print(f"Index '{INDEX_NAME}' not found. Please run model_training.ipynb first.")
                # Creating a dummy index to allow the server to run locally
                pc.create_index(
                    name=INDEX_NAME, 
                    dimension=EMBEDDING_DIMENSION, 
                    metric='cosine', 
                    spec=ServerlessSpec(cloud='aws', region='us-west-2')
                )
                time.sleep(5) # Give it time to initialize
                
            pinecone_index = pc.Index(INDEX_NAME)
            print(f"Successfully connected to Pinecone index: {INDEX_NAME}")
            
        except Exception as e:
            print(f"CRITICAL ERROR: Failed to connect to Pinecone. Recommendations will fail. {e}")
            pinecone_index = None

# --- Mock GenAI Implementation (Replaces a real LLM for demonstration) ---
class MockLLM:
    """A mock class to simulate a lightweight LLM response for description generation."""
    def run(self, **kwargs):
        title = kwargs.get("title", "Item")
        material = kwargs.get("material", "Unknown")
        color = kwargs.get("color", "Neutral")
        
        # This simulates a creative, contextual GenAI output
        return (f"Behold the '{title}' in glorious {color} {material}. "
                f"Its graceful form invites relaxation and elevates any room "
                f"into a sanctuary of modern design. A statement piece.")

def generate_creative_description(product_data: dict) -> str:
    """
    Uses GenAI (via LangChain mock) to create a creative product description.
    """
    if pinecone_index is None:
        return "GENAI FAILED: Vector DB not connected, cannot generate description."
        
    # Instantiate the Mock LLM and use a simple Prompt Template
    mock_llm = MockLLM()
    
    # LangChain Prompt Template for GenAI requirement
    prompt_template = PromptTemplate(
        template="""
        Write a short, creative, and inviting 50-word sales description for a piece of furniture 
        with the following details: 
        Title: {title}, 
        Material: {material}, 
        Color: {color},
        Category: {categories}.
        
        Focus on emotion, design, and luxury.
        """,
        input_variables=["title", "material", "color", "categories"]
    )
    
    # The LLMChain represents the required LangChain integration
    llm_chain = LLMChain(prompt=prompt_template, llm=mock_llm)
    
    # Generate description
    description = llm_chain.run(
        title=product_data.get('title', 'Product'),
        material=product_data.get('material', 'Wood'), 
        color=product_data.get('color', 'Neutral'),
        categories=product_data.get('categories', 'Furniture')
    )
    
    return description.strip()

# --- Recommendation Core Function ---
def get_recommendations(query: str, top_k: int = 5) -> List[Dict]:
    """
    Embeds the user query and performs semantic search using Pinecone.
    """
    if pinecone_index is None or recommendation_model is None:
        print("AI services not initialized.")
        return []

    try:
        # 1. Embed the user query (NLP)
        query_vector = recommendation_model.encode(query).tolist()

        # 2. Search the Pinecone index (ML/Vector DB)
        search_results = pinecone_index.query(
            vector=query_vector,
            top_k=top_k,
            include_metadata=True
        )
        
        recommendations = []
        for match in search_results['matches']:
            product_data = match['metadata']
            
            # Generate the creative description (GenAI) for the product
            gen_desc = generate_creative_description(product_data)
            
            # Combine all required data
            recommendations.append({
                "title": product_data.get('title'),
                "price": product_data.get('price'),
                "image_url": product_data.get('images'),
                "categories": product_data.get('categories'),
                "material": product_data.get('material'),
                "color": product_data.get('color'),
                "creative_description": gen_desc # GenAI Output
            })
            
        return recommendations

    except Exception as e:
        print(f"Error during recommendation process: {e}")
        return []