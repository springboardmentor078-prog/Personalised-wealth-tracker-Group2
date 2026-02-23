# 🎯 START HERE - Backend Quick Start

## What You Have

✅ Complete React frontend (your original files)
✅ Complete FastAPI backend with Swagger (newly added)
✅ All documentation and setup scripts

---

## 🚀 FASTEST WAY TO RUN BACKEND

### Windows Users (3 Steps)

1. **Extract the zip file** to a folder

2. **Open Command Prompt** and navigate:
   ```batch
   cd path\to\risk-profile-navigator-main\backend
   ```

3. **Run the startup script:**
   ```batch
   start-windows.bat
   ```

That's it! Open http://localhost:8000/docs

---

### Mac/Linux Users (3 Steps)

1. **Extract the zip file** to a folder

2. **Open Terminal** and navigate:
   ```bash
   cd path/to/risk-profile-navigator-main/backend
   ```

3. **Run the startup script:**
   ```bash
   chmod +x start-mac-linux.sh
   ./start-mac-linux.sh
   ```

That's it! Open http://localhost:8000/docs

---

## 🤔 Not Working? Try Manual Method

### Manual Setup (All Platforms)

```bash
# 1. Go to backend folder
cd backend

# 2. Create virtual environment
python -m venv venv
# or on Mac/Linux:
python3 -m venv venv

# 3. Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 4. Install packages
pip install -r requirements.txt

# 5. Create environment file
# Windows:
copy .env.example .env
# Mac/Linux:
cp .env.example .env

# 6. Run the server
python -m uvicorn app.main:app --reload
```

---

## ✅ How to Know It's Working

You'll see this in terminal:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

Then open these URLs:
- **Swagger UI**: http://localhost:8000/docs ← Start here!
- **API Health**: http://localhost:8000/health
- **API Info**: http://localhost:8000/

---

## 🧪 Test the API

### Option 1: Use Swagger UI (Easiest!)

1. Open http://localhost:8000/docs
2. Click on **"GET /api/v1/risk-profile/questions"**
3. Click **"Try it out"**
4. Click **"Execute"**
5. See the response!

### Option 2: Use curl

```bash
curl http://localhost:8000/api/v1/risk-profile/questions
```

### Option 3: Use Browser

Just visit: http://localhost:8000/api/v1/risk-profile/questions

---

## 🆘 Having Issues?

### Check These Files (In Order):

1. **backend/TROUBLESHOOTING.md** ← Common errors & fixes
2. **backend/STARTUP_GUIDE.md** ← Detailed step-by-step
3. **backend/test_minimal.py** ← Run this to test setup

### Quick Diagnostics:

```bash
cd backend
python test_minimal.py
```

This will tell you exactly what's wrong!

---

## 📁 What's in the Package

```
risk-profile-navigator-main/
│
├── 📂 backend/                    ← FastAPI Backend (NEW!)
│   ├── app/                       ← Main application code
│   ├── start-windows.bat          ← Windows startup script
│   ├── start-mac-linux.sh         ← Mac/Linux startup script
│   ├── test_minimal.py            ← Setup verification
│   ├── STARTUP_GUIDE.md           ← Detailed instructions
│   ├── TROUBLESHOOTING.md         ← Problem solving
│   └── requirements.txt           ← Python packages
│
├── 📂 src/                        ← Your React frontend
├── 📂 public/                     ← Static files
├── QUICKSTART.md                  ← 5-minute guide
└── IMPLEMENTATION_SUMMARY.md      ← What was added
```

---

## 🎯 Next Steps After Backend Starts

1. **Explore Swagger UI** at http://localhost:8000/docs
2. **Try the API endpoints** - they all work immediately!
3. **Connect your frontend** - Update API URL in frontend config
4. **Read the API docs** - See backend/API_DOCUMENTATION.md

---

## 🔥 Most Common Issue

**"ModuleNotFoundError: No module named 'fastapi'"**

**Fix:**
```bash
# Make sure virtual environment is activated
# You should see (venv) in your terminal

# Then install:
pip install -r requirements.txt
```

---

## 💡 Quick Tips

✅ Keep the terminal open while backend runs
✅ Use CTRL+C to stop the server
✅ Backend runs on port 8000
✅ Frontend runs on port 5173 (separate terminal)
✅ Swagger UI is your friend - use it to test APIs!

---

## 🎓 What You Can Do With This Backend

### Risk Profile API
- Get assessment questions
- Calculate risk profiles
- Get personalized recommendations

### Portfolio API
- Add/remove positions
- Track portfolio value
- Set investment goals
- Record transactions

**All with full Swagger documentation!**

---

## 📞 Need More Help?

1. Run `python test_minimal.py` - Tells you what's wrong
2. Check `TROUBLESHOOTING.md` - Common fixes
3. Check `STARTUP_GUIDE.md` - Detailed steps
4. Visit http://localhost:8000/docs - API documentation

---

## ⚡ TL;DR - Absolute Quickest Start

```bash
cd backend
pip install fastapi uvicorn pydantic pydantic-settings
python -m uvicorn app.main:app --reload
```

Open: http://localhost:8000/docs

**That's it!** 🚀

---

**Need Python?** Download from https://www.python.org/downloads/

**Remember:** Backend is a separate server from your React frontend!
