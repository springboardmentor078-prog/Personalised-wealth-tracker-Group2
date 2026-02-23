#!/bin/bash

# Risk Profile Navigator Backend Startup Script

echo "🚀 Starting Risk Profile Navigator API..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration!"
fi

# Run the server
echo "✅ Starting FastAPI server..."
echo "📖 Swagger UI: http://localhost:8000/docs"
echo "📘 ReDoc: http://localhost:8000/redoc"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
