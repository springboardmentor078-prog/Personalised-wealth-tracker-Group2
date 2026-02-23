# Risk Profile Navigator

A comprehensive investment portfolio management application with risk profile assessment and personalized recommendations.

## 🌟 Features

### Frontend
- **Risk Profile Assessment** - Interactive questionnaire to determine investment risk tolerance
- **Portfolio Management** - Track stocks, ETFs, bonds, and crypto investments
- **Investment Goals** - Set and monitor financial goals
- **Transaction History** - Record and view all portfolio transactions
- **Interactive Dashboard** - Real-time portfolio performance metrics
- **Responsive Design** - Beautiful UI with shadcn-ui components

### Backend API
- **FastAPI Backend** - High-performance RESTful API
- **Swagger Documentation** - Interactive API documentation at `/docs`
- **Risk Calculation Engine** - Sophisticated risk profiling algorithm
- **Portfolio Analytics** - Real-time portfolio calculations
- **CORS Support** - Ready for frontend integration
- **Type-Safe** - Full Pydantic validation

## 🏗️ Project Structure

```
risk-profile-navigator/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/               # API routes and endpoints
│   │   ├── core/              # Configuration and security
│   │   ├── schemas/           # Pydantic models
│   │   ├── services/          # Business logic
│   │   └── main.py            # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Docker configuration
│   ├── docker-compose.yml     # Docker Compose setup
│   └── README.md              # Backend documentation
│
├── src/                       # React Frontend
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   ├── context/               # React context
│   ├── hooks/                 # Custom hooks
│   ├── types/                 # TypeScript types
│   └── data/                  # Mock data
│
├── public/                    # Static assets
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm (for frontend)
- **Python** 3.11+ (for backend)
- **Docker** (optional, for containerized deployment)

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

#### Option 1: Local Development

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Update .env with your configuration

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Option 2: Docker

```bash
# Navigate to backend directory
cd backend

# Start services with Docker Compose
docker-compose up -d
```

The API will be available at:
- **API Base**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📚 API Documentation

### Quick Reference

**Risk Profile Endpoints:**
- `GET /api/v1/risk-profile/questions` - Get assessment questions
- `POST /api/v1/risk-profile/calculate` - Calculate risk profile

**Portfolio Endpoints:**
- `GET /api/v1/portfolio/positions` - Get all positions
- `POST /api/v1/portfolio/positions` - Add position
- `GET /api/v1/portfolio/summary` - Get portfolio summary
- `GET /api/v1/portfolio/goals` - Get investment goals
- `POST /api/v1/portfolio/goals` - Create goal
- `GET /api/v1/portfolio/transactions` - Get transactions
- `POST /api/v1/portfolio/transactions` - Record transaction

For complete API documentation, see:
- [Backend API Documentation](./backend/API_DOCUMENTATION.md)
- Interactive Swagger UI at `/docs` when running

### Example API Usage

**Calculate Risk Profile:**
```bash
curl -X POST "http://localhost:8000/api/v1/risk-profile/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": {
      "1": 3, "2": 4, "3": 2, "4": 3, 
      "5": 3, "6": 3, "7": 4
    }
  }'
```

**Add Portfolio Position:**
```bash
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
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **shadcn-ui** - Component library
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Recharts** - Data visualization
- **Supabase** - Backend services (optional)

### Backend
- **FastAPI** - Web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **SQLAlchemy** - ORM (ready for database integration)
- **Python-JOSE** - JWT tokens
- **Passlib** - Password hashing

## 🔧 Configuration

### Frontend Environment Variables

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_API_URL=http://localhost:8000/api/v1
```

### Backend Environment Variables

Create a `.env` file in the `backend` directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/risk_profile_db
SECRET_KEY=your-secret-key-here
API_V1_STR=/api/v1
PROJECT_NAME=Risk Profile Navigator API
BACKEND_CORS_ORIGINS=["http://localhost:5173"]
```

## 📖 Development

### Running Tests

**Frontend:**
```bash
npm test
```

**Backend:**
```bash
cd backend
pytest
```

### Building for Production

**Frontend:**
```bash
npm run build
```

**Backend:**
```bash
cd backend
docker build -t risk-profile-api .
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is part of the Risk Profile Navigator application.

## 🔗 Links

- [Backend Documentation](./backend/README.md)
- [API Documentation](./backend/API_DOCUMENTATION.md)
- [Swagger UI](http://localhost:8000/docs) (when running)

 Live Demo

- 🔗 Frontend: https://storage.googleapis.com/divya-frontend-site-123/index.html  
- 🔗 Backend API Docs: https://risk-profile-navigator-backend-k3c5.onrender.com/docs
