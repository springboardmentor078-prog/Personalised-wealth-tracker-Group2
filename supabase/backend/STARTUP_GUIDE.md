# 🚀 BACKEND STARTUP GUIDE - Step by Step

## Choose Your Method

### ✅ METHOD 1: Simple Python Setup (RECOMMENDED FOR BEGINNERS)

This is the easiest way to get started without Docker.

#### Step 1: Check Python Version
```bash
python --version
# or
python3 --version
```
**Need Python 3.11 or higher**

#### Step 2: Navigate to Backend
```bash
cd backend
```

#### Step 3: Create Virtual Environment
**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

#### Step 4: Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### Step 5: Create Environment File
```bash
# On Windows
copy .env.example .env

# On Mac/Linux
cp .env.example .env
```

#### Step 6: Edit .env File
Open `.env` and change the SECRET_KEY:
```env
SECRET_KEY=my-super-secret-key-change-this-123456
DATABASE_URL=sqlite:///./test.db
API_V1_STR=/api/v1
PROJECT_NAME=Risk Profile Navigator API
```

#### Step 7: Run the Server
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Step 8: Test It
Open your browser to:
- **Swagger UI**: http://localhost:8000/docs
- **API**: http://localhost:8000/health

---

### ✅ METHOD 2: Using Docker (RECOMMENDED FOR DEPLOYMENT)

**Prerequisites:** Docker Desktop installed

#### Step 1: Navigate to Backend
```bash
cd backend
```

#### Step 2: Start with Docker Compose
```bash
docker-compose up -d
```

#### Step 3: Check Logs
```bash
docker-compose logs -f backend
```

#### Step 4: Test It
Open: http://localhost:8000/docs

#### To Stop:
```bash
docker-compose down
```

---

### ✅ METHOD 3: Direct Python Run (Quick Test)

#### Step 1: Navigate to Backend
```bash
cd backend
```

#### Step 2: Install Dependencies Globally (Not Recommended for Production)
```bash
pip install fastapi uvicorn pydantic pydantic-settings python-jose passlib python-multipart
```

#### Step 3: Set Environment Variables
**On Windows:**
```bash
set SECRET_KEY=test-secret-key
set DATABASE_URL=sqlite:///./test.db
```

**On Mac/Linux:**
```bash
export SECRET_KEY=test-secret-key
export DATABASE_URL=sqlite:///./test.db
```

#### Step 4: Run
```bash
python -m uvicorn app.main:app --reload
```

---

## 🔥 COMMON ERRORS AND FIXES

### Error: "python: command not found"
**Fix:**
```bash
# Try python3 instead
python3 --version
python3 -m venv venv
```

### Error: "pip: command not found"
**Fix:**
```bash
# Use python -m pip instead
python -m pip install -r requirements.txt
```

### Error: "Permission denied" when running run.sh
**Fix:**
```bash
chmod +x run.sh
./run.sh
```

### Error: "ModuleNotFoundError: No module named 'fastapi'"
**Fix:**
```bash
# Make sure virtual environment is activated
# You should see (venv) in your prompt
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Then install again
pip install -r requirements.txt
```

### Error: "Port 8000 is already in use"
**Fix:**
```bash
# Use a different port
uvicorn app.main:app --reload --port 8001

# Or find and kill the process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9
```

### Error: "No module named 'app'"
**Fix:**
```bash
# Make sure you're in the backend directory
cd backend
pwd  # Should show .../backend

# Run from backend directory
python -m uvicorn app.main:app --reload
```

### Error: "SECRET_KEY not set"
**Fix:**
```bash
# Create .env file
cp .env.example .env

# Or set it directly in terminal
export SECRET_KEY=any-random-string-here  # Mac/Linux
set SECRET_KEY=any-random-string-here     # Windows
```

---

## ✅ VERIFICATION STEPS

After starting the backend, verify it's working:

### 1. Check Health Endpoint
```bash
curl http://localhost:8000/health
```
Should return:
```json
{"status": "healthy", "version": "1.0.0"}
```

### 2. Open Swagger UI
Navigate to: http://localhost:8000/docs

You should see interactive API documentation.

### 3. Test an Endpoint
```bash
curl http://localhost:8000/api/v1/risk-profile/questions
```

---

## 📝 WHAT YOU SHOULD SEE

When the backend starts successfully, you'll see:

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

---

## 🎯 QUICK START (Copy-Paste)

**Windows:**
```batch
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python -m uvicorn app.main:app --reload
```

**Mac/Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python -m uvicorn app.main:app --reload
```

---

## 🆘 STILL NOT WORKING?

### Check Your Setup:
```bash
# 1. Python version
python --version

# 2. Are you in the backend directory?
pwd

# 3. Is virtual environment activated?
# You should see (venv) in your prompt

# 4. Check if dependencies are installed
pip list | grep fastapi
```

### Get Debug Info:
```bash
cd backend
python -c "import sys; print(sys.version)"
python -c "import fastapi; print(fastapi.__version__)"
```

### Manual Test:
Create a test file `test_server.py` in backend directory:
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "It works!"}
```

Run it:
```bash
uvicorn test_server:app --reload
```

If this works, the issue is with the main app configuration.

---

## 📞 Need More Help?

1. **Check the error message** - Copy the full error and search for it
2. **Python version** - Make sure it's 3.11+
3. **Virtual environment** - Always use one
4. **Dependencies** - Install from requirements.txt
5. **Environment variables** - Create .env file

**Pro Tip:** Start with METHOD 1 (Simple Python Setup) first!
