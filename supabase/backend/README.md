# Risk Profile Navigator - FastAPI Backend

A robust FastAPI backend for the Risk Profile Navigator application with comprehensive Swagger documentation.

## Features

- ✅ **Risk Profile Assessment API** - Calculate investment risk profiles based on questionnaire
- ✅ **Portfolio Management API** - Manage investment positions, goals, and transactions
- ✅ **Interactive Swagger UI** - Auto-generated API documentation at `/docs`
- ✅ **ReDoc Documentation** - Alternative documentation at `/redoc`
- ✅ **CORS Support** - Configure allowed origins for frontend integration
- ✅ **Pydantic Validation** - Strong type validation for all API requests/responses
- ✅ **Modular Architecture** - Clean separation of concerns with services, schemas, and endpoints

## API Endpoints

### Risk Profile

- `GET /api/v1/risk-profile/questions` - Get all risk assessment questions
- `POST /api/v1/risk-profile/calculate` - Calculate risk profile from answers

### Portfolio

- `GET /api/v1/portfolio/positions` - Get all portfolio positions
- `POST /api/v1/portfolio/positions` - Add new position
- `DELETE /api/v1/portfolio/positions/{id}` - Remove position
- `GET /api/v1/portfolio/summary` - Get portfolio summary
- `GET /api/v1/portfolio/goals` - Get investment goals
- `POST /api/v1/portfolio/goals` - Create new goal
- `DELETE /api/v1/portfolio/goals/{id}` - Remove goal
- `GET /api/v1/portfolio/transactions` - Get transaction history
- `POST /api/v1/portfolio/transactions` - Record new transaction

### Health & Info

- `GET /` - API information
- `GET /health` - Health check endpoint

## Quick Start

### Prerequisites

- Python 3.11 or higher
- pip or uv package manager

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Update `.env` with your configuration:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/risk_profile_db
SECRET_KEY=your-secret-key-here
```

### Running the Server

```bash
# From the backend directory
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API Base**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/api/v1/openapi.json

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── risk_profile.py    # Risk profile endpoints
│   │       │   └── portfolio.py       # Portfolio endpoints
│   │       └── api.py                 # API router
│   ├── core/
│   │   ├── config.py                  # Configuration settings
│   │   └── security.py                # Security utilities
│   ├── models/                        # Database models (future)
│   ├── schemas/
│   │   ├── risk_profile.py           # Risk profile schemas
│   │   └── portfolio.py              # Portfolio schemas
│   ├── services/
│   │   └── risk_profile.py           # Risk profile service
│   └── main.py                       # FastAPI application
├── requirements.txt                  # Python dependencies
├── .env.example                     # Environment variables template
└── README.md                        # This file
```

## API Examples

### Calculate Risk Profile

**Request:**
```bash
curl -X POST "http://localhost:8000/api/v1/risk-profile/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": {
      "1": 3,
      "2": 4,
      "3": 2,
      "4": 3,
      "5": 3,
      "6": 3,
      "7": 4
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_score": 22,
    "risk_level": "aggressive",
    "title": "Aggressive Investor",
    "description": "You are comfortable with market volatility...",
    "recommended_allocation": {
      "stocks": 65,
      "bonds": 25,
      "cash": 5,
      "alternatives": 5
    }
  },
  "message": "Risk profile calculated successfully"
}
```

### Add Portfolio Position

**Request:**
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

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black app/
isort app/
```

### Type Checking

```bash
mypy app/
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `SECRET_KEY` | Secret key for JWT tokens | Required |
| `API_V1_STR` | API version prefix | `/api/v1` |
| `PROJECT_NAME` | Project name for docs | `Risk Profile Navigator API` |
| `BACKEND_CORS_ORIGINS` | Allowed CORS origins | `[]` |

## Tech Stack

- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server
- **SQLAlchemy** - SQL toolkit and ORM (for future database integration)
- **Python-JOSE** - JWT token handling
- **Passlib** - Password hashing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is part of the Risk Profile Navigator application.
