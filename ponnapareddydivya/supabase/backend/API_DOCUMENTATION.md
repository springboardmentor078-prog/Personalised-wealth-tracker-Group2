# Risk Profile Navigator API Documentation

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

Currently, the API does not require authentication for most endpoints. JWT-based authentication infrastructure is prepared for future implementation.

## API Endpoints

### Risk Profile Endpoints

#### Get Risk Questions

Retrieve all risk assessment questions for the questionnaire.

**Endpoint:** `GET /risk-profile/questions`

**Response:**
```json
[
  {
    "id": 1,
    "question": "What is your primary investment goal?",
    "options": [
      {
        "text": "Preserve my capital with minimal risk",
        "score": 1
      },
      {
        "text": "Generate steady income with low to moderate risk",
        "score": 2
      },
      {
        "text": "Balance growth and income with moderate risk",
        "score": 3
      },
      {
        "text": "Maximize growth, accepting higher volatility",
        "score": 4
      }
    ]
  }
  // ... more questions
]
```

#### Calculate Risk Profile

Calculate investment risk profile based on questionnaire answers.

**Endpoint:** `POST /risk-profile/calculate`

**Request Body:**
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

**Response:**
```json
{
  "success": true,
  "data": {
    "total_score": 22,
    "risk_level": "aggressive",
    "title": "Aggressive Investor",
    "description": "You are comfortable with market volatility in pursuit of higher returns...",
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

**Risk Levels:**
- `conservative` (Score: 0-30%)
- `moderate` (Score: 31-50%)
- `aggressive` (Score: 51-75%)
- `very-aggressive` (Score: 76-100%)

---

### Portfolio Endpoints

#### Get All Positions

Retrieve all investment positions in the portfolio.

**Endpoint:** `GET /portfolio/positions`

**Response:**
```json
[
  {
    "id": "pos_1",
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "quantity": 10,
    "avg_price": 150.0,
    "current_price": 175.5,
    "total_value": 1755.0,
    "change": 255.0,
    "change_percent": 17.0,
    "sector": "Technology",
    "type": "stock"
  }
]
```

#### Add Portfolio Position

Add a new investment position to the portfolio.

**Endpoint:** `POST /portfolio/positions`

**Request Body:**
```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "quantity": 10,
  "avg_price": 150.0,
  "current_price": 175.5,
  "sector": "Technology",
  "type": "stock"
}
```

**Response:** Returns the created position with calculated values.

**Position Types:**
- `stock`
- `etf`
- `bond`
- `crypto`

#### Delete Position

Remove a position from the portfolio.

**Endpoint:** `DELETE /portfolio/positions/{position_id}`

**Response:** 204 No Content

#### Get Portfolio Summary

Get aggregated portfolio performance metrics.

**Endpoint:** `GET /portfolio/summary`

**Response:**
```json
{
  "total_value": 25000.0,
  "total_gain": 3500.0,
  "total_gain_percent": 16.28,
  "day_change": 300.0,
  "day_change_percent": 1.2
}
```

---

### Goals Endpoints

#### Get All Goals

Retrieve all investment goals.

**Endpoint:** `GET /portfolio/goals`

**Response:**
```json
[
  {
    "id": "goal_1",
    "name": "Emergency Fund",
    "target_amount": 10000.0,
    "current_amount": 5000.0,
    "deadline": "2025-12-31",
    "category": "Savings",
    "priority": "high",
    "description": "Build 6-month emergency fund"
  }
]
```

#### Create Goal

Create a new investment goal.

**Endpoint:** `POST /portfolio/goals`

**Request Body:**
```json
{
  "name": "Emergency Fund",
  "target_amount": 10000.0,
  "current_amount": 5000.0,
  "deadline": "2025-12-31",
  "category": "Savings",
  "priority": "high",
  "description": "Build 6-month emergency fund"
}
```

**Priority Levels:**
- `high`
- `medium`
- `low`

#### Delete Goal

Remove an investment goal.

**Endpoint:** `DELETE /portfolio/goals/{goal_id}`

**Response:** 204 No Content

---

### Transaction Endpoints

#### Get All Transactions

Retrieve all portfolio transactions.

**Endpoint:** `GET /portfolio/transactions`

**Response:**
```json
[
  {
    "id": "txn_1",
    "date": "2024-02-09T10:30:00",
    "type": "buy",
    "symbol": "AAPL",
    "quantity": 10,
    "price": 150.0,
    "amount": 1500.0,
    "description": "Bought Apple shares"
  }
]
```

#### Record Transaction

Record a new portfolio transaction.

**Endpoint:** `POST /portfolio/transactions`

**Request Body:**
```json
{
  "type": "buy",
  "symbol": "AAPL",
  "quantity": 10,
  "price": 150.0,
  "amount": 1500.0,
  "description": "Bought Apple shares"
}
```

**Transaction Types:**
- `buy`
- `sell`
- `dividend`
- `deposit`
- `withdrawal`

---

### Health & Info Endpoints

#### Root

Get API information.

**Endpoint:** `GET /`

**Response:**
```json
{
  "message": "Welcome to Risk Profile Navigator API",
  "version": "1.0.0",
  "docs": "/docs",
  "redoc": "/redoc"
}
```

#### Health Check

Check API health status.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

**400 Bad Request:**
```json
{
  "detail": "Invalid input data"
}
```

**404 Not Found:**
```json
{
  "detail": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "detail": "An error occurred while processing your request"
}
```

---

## Data Validation

All request data is validated using Pydantic models. Invalid data will result in a 422 Unprocessable Entity response with detailed validation errors:

```json
{
  "detail": [
    {
      "loc": ["body", "quantity"],
      "msg": "ensure this value is greater than 0",
      "type": "value_error.number.not_gt"
    }
  ]
}
```

---

## CORS

The API supports Cross-Origin Resource Sharing (CORS) and can be configured via environment variables to allow specific origins.

---

## Rate Limiting

Currently, no rate limiting is implemented. This will be added in future versions for production use.

---

## Interactive Documentation

Visit these URLs when the server is running:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **OpenAPI JSON:** http://localhost:8000/api/v1/openapi.json
