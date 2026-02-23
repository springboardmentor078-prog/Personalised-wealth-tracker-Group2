# 🔧 Backend Not Running? Follow This Guide

## 🎯 EASIEST WAY TO START (Choose One)

### Option A: Windows Users
```batch
1. Open Command Prompt or PowerShell
2. Navigate to backend folder:
   cd path\to\risk-profile-navigator-main\backend

3. Double-click: start-windows.bat
   OR run: start-windows.bat
```

### Option B: Mac/Linux Users
```bash
1. Open Terminal
2. Navigate to backend folder:
   cd path/to/risk-profile-navigator-main/backend

3. Run: ./start-mac-linux.sh
```

---

## 🐛 Problem? Follow This Checklist

### □ Step 1: Check Python Installation
```bash
python --version
# or
python3 --version
```

**Expected:** Python 3.11.x or higher

**If this fails:**
- Download Python from https://www.python.org/downloads/
- During installation, CHECK "Add Python to PATH"
- Restart terminal after installation

---

### □ Step 2: Check You're in the Right Directory
```bash
# Windows
cd

# Mac/Linux  
pwd
```

**Expected:** Should end with `/backend` or `\backend`

**Wrong directory?**
```bash
cd backend
```

---

### □ Step 3: Test Your Setup
```bash
# From backend directory
python test_minimal.py
```

**This will tell you exactly what's wrong!**

---

### □ Step 4: Install Dependencies Manually
```bash
# Windows
python -m pip install fastapi uvicorn pydantic pydantic-settings

# Mac/Linux
python3 -m pip install fastapi uvicorn pydantic pydantic-settings
```

---

### □ Step 5: Create .env File
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

---

### □ Step 6: Try Running Manually
```bash
# Windows
python -m uvicorn app.main:app --reload

# Mac/Linux
python3 -m uvicorn app.main:app --reload
```

---

## 🔥 COMMON ERROR MESSAGES & FIXES

### Error: "python is not recognized"
```
✗ Python is not installed or not in PATH

FIX:
1. Install Python from python.org
2. Check "Add to PATH" during installation
3. Restart your terminal/computer
```

### Error: "No module named 'fastapi'"
```
✗ Dependencies not installed

FIX:
pip install -r requirements.txt
```

### Error: "No module named 'app'"
```
✗ Wrong directory or missing __init__.py files

FIX:
1. Make sure you're in the backend directory
   cd backend
   
2. Check if app folder exists
   ls app/  (Mac/Linux)
   dir app\  (Windows)
```

### Error: "Address already in use" or "Port 8000 in use"
```
✗ Port 8000 is already being used

FIX - Use different port:
python -m uvicorn app.main:app --reload --port 8001

FIX - Kill existing process:
Windows:
  netstat -ano | findstr :8000
  taskkill /PID <number> /F

Mac/Linux:
  lsof -ti:8000 | xargs kill -9
```

### Error: "SECRET_KEY not set"
```
✗ Environment variables not configured

FIX:
1. Create .env file:
   copy .env.example .env  (Windows)
   cp .env.example .env    (Mac/Linux)

2. Edit .env and change SECRET_KEY to anything
```

### Error: "ModuleNotFoundError: No module named 'pydantic_settings'"
```
✗ Missing dependency

FIX:
pip install pydantic-settings
```

---

## ✅ SUCCESS INDICATORS

When everything works, you'll see:

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx]
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Then open:** http://localhost:8000/docs

You should see the Swagger UI with all API endpoints!

---

## 🆘 STILL STUCK? TRY THIS

### Nuclear Option - Start Fresh

**Windows:**
```batch
cd backend
rmdir /s /q venv
del .env
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python -m uvicorn app.main:app --reload
```

**Mac/Linux:**
```bash
cd backend
rm -rf venv
rm .env
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python -m uvicorn app.main:app --reload
```

---

## 📞 Need Help? Check These Files

1. **STARTUP_GUIDE.md** - Detailed step-by-step instructions
2. **README.md** - Backend overview
3. **API_DOCUMENTATION.md** - API details

---

## 💡 Pro Tips

✓ Always activate virtual environment before running
✓ Check you're in the backend directory
✓ Use `python -m` prefix for better compatibility
✓ Keep terminal open while server runs
✓ Check http://localhost:8000/docs to verify it's working
✓ Press CTRL+C to stop the server

---

## 🎬 Quick Video Guide

**What You'll Do:**
1. Open terminal
2. Go to backend folder
3. Run startup script OR follow manual steps
4. Open http://localhost:8000/docs
5. See Swagger UI with all endpoints!

**Expected Time:** 2-5 minutes

---

## 📊 Checklist Before Asking for Help

- [ ] Python 3.11+ installed
- [ ] In the backend directory
- [ ] Virtual environment created
- [ ] Dependencies installed (pip install -r requirements.txt)
- [ ] .env file exists
- [ ] Port 8000 is free
- [ ] Ran test_minimal.py to check setup

If all checked, copy error message and check online!
