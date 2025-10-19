AI Furniture Recommender (FastAPI + React)

This is a complete, full-stack web application built for the AI/ML Intern Assignment. It uses a Vector Database (Pinecone) to power furniture recommendations and Generative AI to create unique product descriptions.

🔑 Key Technologies

The project is built on the following technologies:

Backend: We use FastAPI (Python) to connect the user interface to the AI models and the database.

Frontend: The web application interface (Chat and Dashboard) is built with React.

Database: Pinecone acts as our Vector Database, storing product embeddings for fast semantic search (ML).

AI Layer: We use LangChain to easily integrate the Generative AI model for creating creative text.

Core ML: Sentence Transformers are used to create high-quality product embeddings for matching the user's request.

📁 Project Setup

The project is split into three main parts: backend, frontend, and notebooks.

Step 1: Set Up Python Backend

The backend needs Python libraries and a virtual environment.

Go to the backend folder:

cd backend



Create and activate a virtual environment:

python -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows



Install all required libraries:

pip install -r requirements.txt



Step 2: Set Up React Frontend

The frontend needs Node.js packages.

Go to the frontend folder:

cd frontend



Install all required libraries:

npm install



Step 3: Configure API Keys

The backend needs to connect to the Pinecone Vector Database.

Create a file named .env inside the backend/ folder.

Add your Pinecone keys and environment details:

PINECONE_API_KEY="YOUR_PINECONE_API_KEY"
PINECONE_ENVIRONMENT="YOUR_PINECONE_ENVIRONMENT" # e.g., aws-us-west-2



(Note: You must replace the placeholder values with your actual keys.)

🚀 Running the Application

You must run the training script first, then the backend, and finally the frontend.

1. Training & Database Setup (Run First!)

This step runs the ML pipeline and pushes data to Pinecone.

Start your Jupyter Notebook environment (while your Python virtual environment is active):

jupyter notebook



Open and run all cells in notebooks/model_training.ipynb.

This notebook prepares the data, generates embeddings, and populates the Pinecone index named furniture-recommender.

2. Start the Backend API

Open a new terminal, make sure the Python environment is active, and run the FastAPI server:

cd backend
uvicorn main:app --reload


3. Start the Frontend App

Open a third terminal, go to the frontend folder, and start the React application:

cd frontend
npm start


✨ Features

The application is complete and includes two working views:

Recommendation Chat: Enter a detailed prompt (e.g., "a small, round wooden table for a kitchen"). The API searches the Pinecone vector space and returns semantic matches, each with a freshly generated creative description from the GenAI model.

Analytics Dashboard: Displays interactive charts (using Recharts) of product counts, average prices by material, and top brands, based on the metrics calculated in data_analytics.ipynb.

📜 Deliverables Included

The repository contains all required files for submission:

Frontend (React App): Modular code in frontend/src/

Backend (FastAPI App): Logic in backend/

Model Training Notebook: notebooks/model_training.ipynb

Data Analytics Notebook: notebooks/data_analytics.ipynb

Instructions (README.md): This document.
