@echo off
echo ========================================
echo  Risk Profile Navigator - Backend Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.11 or higher from python.org
    pause
    exit /b 1
)

echo [1/6] Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    echo Virtual environment created!
) else (
    echo Virtual environment already exists.
)
echo.

echo [2/6] Activating virtual environment...
call venv\Scripts\activate.bat
echo.

echo [3/6] Upgrading pip...
python -m pip install --upgrade pip --quiet
echo.

echo [4/6] Installing dependencies...
pip install -r requirements.txt --quiet
echo Dependencies installed!
echo.

echo [5/6] Setting up environment file...
if not exist ".env" (
    copy .env.example .env >nul
    echo .env file created! Please update SECRET_KEY if needed.
) else (
    echo .env file already exists.
)
echo.

echo [6/6] Starting FastAPI server...
echo.
echo ========================================
echo  Backend is starting...
echo  Swagger UI: http://localhost:8000/docs
echo  API Base:   http://localhost:8000
echo  Press CTRL+C to stop
echo ========================================
echo.

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
