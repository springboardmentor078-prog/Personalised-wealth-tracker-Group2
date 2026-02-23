# Quick Start Guide - Risk Profile Navigator

## 🎯 Getting Started in 5 Minutes

### Prerequisites Check
```bash
# Check Node.js version (need 18+)
node --version

# Check Python version (need 3.11+)
python --version

# Check npm
npm --version
```

### Step 1: Clone & Setup

```bash
# Clone or extract the project
cd risk-profile-navigator-main

# Install frontend dependencies
npm install
```

### Step 2: Start Backend

**Option A: Quick Start (No Database)**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

**Option B: Docker (Recommended)**
```bash
cd backend
docker-compose up -d
```

✅ Backend running at: http://localhost:8000
📖 Swagger docs at: http://localhost:8000/docs

### Step 3: Start Frontend

```bash
# In a new terminal, from project root
npm run dev
```

✅ Frontend running at: http://localhost:5173

## 🎮 Test the API

### Using Swagger UI (Easiest)
1. Open http://localhost:8000/docs
2. Try the "GET /risk-profile/questions" endpoint
3. Expand "POST /risk-profile/calculate"
4. Click "Try it out"
5. Use this sample data:
```json
{
  "answers": {
    "1": 3,
    "2": 4,
    "3": 2,
    "4": 3,
    "5": 3,
    "6": 3,
    "7": 4
  }
}
```
6. Click "Execute"

### Using cURL
```bash
# Get questions
curl http://localhost:8000/api/v1/risk-profile/questions

# Calculate risk profile
curl -X POST "http://localhost:8000/api/v1/risk-profile/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": {
      "1": 3, "2": 4, "3": 2, "4": 3,
      "5": 3, "6": 3, "7": 4
    }
  }'

# Add a position
curl -X POST "http://localhost:8000/api/v1/portfolio/positions" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "quantity": 10,
    "avg_price": 150.00,
    "current_price": 175.50,
    "sector": "Technology",
    "type": "stock"
  }'

# Get portfolio summary
curl http://localhost:8000/api/v1/portfolio/summary
```

### Using Postman
1. Import `backend/postman_collection.json`
2. Set base_url to `http://localhost:8000`
3. Try any request from the collection

## 📚 Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/risk-profile/questions` | GET | Get all assessment questions |
| `/api/v1/risk-profile/calculate` | POST | Calculate risk profile |
| `/api/v1/portfolio/positions` | GET | Get all positions |
| `/api/v1/portfolio/positions` | POST | Add new position |
| `/api/v1/portfolio/summary` | GET | Get portfolio summary |
| `/api/v1/portfolio/goals` | GET/POST | Manage goals |
| `/api/v1/portfolio/transactions` | GET/POST | Manage transactions |

## 🎨 Frontend Features

1. **Risk Profile Assessment**
   - Navigate to `/risk-profile`
   - Complete the questionnaire
   - View your risk level and recommendations

2. **Portfolio Dashboard**
   - View at `/dashboard`
   - See portfolio summary and performance

3. **Manage Investments**
   - Go to `/portfolio`
   - Add/remove positions
   - Track performance

4. **Set Goals**
   - Visit `/goals`
   - Create financial goals
   - Monitor progress

## 🔍 Troubleshooting

### Backend won't start
```bash
# Make sure you're in the backend directory
cd backend

# Check if port 8000 is in use
lsof -i :8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Try a different port
uvicorn app.main:app --reload --port 8001
```

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### CORS errors
```bash
# Edit backend/.env
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
```

### Import errors in Python
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Reinstall requirements
pip install -r requirements.txt
```

## 📖 Next Steps

1. **Explore the API**
   - Read [API Documentation](./backend/API_DOCUMENTATION.md)
   - Try all endpoints in Swagger UI
   - Import Postman collection

2. **Customize**
   - Modify risk calculation logic in `backend/app/services/risk_profile.py`
   - Update frontend components in `src/components/`
   - Add new API endpoints in `backend/app/api/v1/endpoints/`

3. **Deploy**
   - Build frontend: `npm run build`
   - Deploy backend with Docker
   - Configure production environment variables

## 💡 Tips

- Use Swagger UI for interactive API testing
- Check browser console for frontend errors
- Use `--reload` flag during development for auto-restart
- Enable CORS in backend for frontend integration
- Keep Swagger docs open while developing

## 🆘 Get Help

- Check the main [README.md](../README.md)
- Review [Backend README](./backend/README.md)
- Read [API Documentation](./backend/API_DOCUMENTATION.md)
- Check Swagger UI at `/docs` for endpoint details

Happy coding! 🚀
