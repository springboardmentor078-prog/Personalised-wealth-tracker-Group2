#!/bin/bash

echo "========================================"
echo " Risk Profile Navigator - Backend Setup"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed"
    echo "Please install Python 3.11 or higher"
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo "Python version: $PYTHON_VERSION"
echo ""

echo "[1/6] Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✓ Virtual environment created!"
else
    echo "✓ Virtual environment already exists."
fi
echo ""

echo "[2/6] Activating virtual environment..."
source venv/bin/activate
echo "✓ Virtual environment activated!"
echo ""

echo "[3/6] Upgrading pip..."
pip install --upgrade pip --quiet
echo "✓ Pip upgraded!"
echo ""

echo "[4/6] Installing dependencies..."
pip install -r requirements.txt --quiet
echo "✓ Dependencies installed!"
echo ""

echo "[5/6] Setting up environment file..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✓ .env file created! Please update SECRET_KEY if needed."
else
    echo "✓ .env file already exists."
fi
echo ""

echo "[6/6] Starting FastAPI server..."
echo ""
echo "========================================"
echo " Backend is starting..."
echo " Swagger UI: http://localhost:8000/docs"
echo " API Base:   http://localhost:8000"
echo " Press CTRL+C to stop"
echo "========================================"
echo ""

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
