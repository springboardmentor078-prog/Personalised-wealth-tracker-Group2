# Nightly Price Refresh — Celery Integration

## Overview

Prices for every tracked investment symbol are refreshed automatically each
night at **00:05 UTC** using a Celery Beat periodic task. Individual symbol
refreshes run in parallel on Celery workers, pulling live prices from
Yahoo Finance and falling back to a stochastic drift model when the network
is unavailable.

```
Celery Beat (scheduler)
  └─▶ refresh_all_prices   (00:05 UTC nightly)
        └─▶ refresh_price  × N symbols  (parallel chunks of 10)
              └─▶ Yahoo Finance v8 JSON API
              └─▶ Fallback: stochastic walk from last known price
              └─▶ PriceCache.update(symbol, price)
```

---

## New files added

| File | Purpose |
|---|---|
| `backend/app/celery_app.py` | Celery application factory + Beat schedule |
| `backend/app/tasks/__init__.py` | Package init |
| `backend/app/tasks/price_refresh.py` | `refresh_price` and `refresh_all_prices` tasks |
| `backend/app/services/price_cache.py` | Thread-safe in-memory price store |
| `backend/app/api/v1/endpoints/prices.py` | REST endpoints for reading/triggering refreshes |

### Modified files

| File | Change |
|---|---|
| `backend/app/core/config.py` | Added `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND` settings |
| `backend/app/api/v1/api.py` | Registered `/prices` router |
| `backend/requirements.txt` | Added `celery[redis]`, `redis` |
| `backend/docker-compose.yml` | Added `redis`, `celery_worker`, `celery_beat`, `flower` services |
| `backend/.env.example` | Added Celery env vars |

---

## Quick start

```bash
# 1. Start everything
docker compose up -d

# 2. Verify the worker is ready
docker compose logs celery_worker | grep "ready"

# 3. Trigger an on-demand refresh
curl -X POST http://localhost:8000/api/v1/prices/refresh/all

# 4. Check prices
curl http://localhost:8000/api/v1/prices/

# 5. Open Flower monitoring UI
open http://localhost:5555
```

---

## REST API

### `GET /api/v1/prices/`
Returns the full cache snapshot.

```json
{
  "AAPL": { "price": 178.50, "updated_at": "2026-02-18T00:05:42Z" },
  "MSFT": { "price": 378.20, "updated_at": "2026-02-18T00:05:43Z" }
}
```

### `GET /api/v1/prices/{symbol}`
```json
{ "symbol": "AAPL", "price": 178.50, "updated_at": "2026-02-18T00:05:42Z" }
```

### `POST /api/v1/prices/refresh`
Refresh specific symbols immediately.
```json
{ "symbols": ["AAPL", "NVDA"] }
```

### `POST /api/v1/prices/refresh/all`
Trigger the full nightly job on-demand.

### `GET /api/v1/prices/refresh/{task_id}`
Poll the status of any refresh task.

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `CELERY_BROKER_URL` | `redis://localhost:6379/0` | Redis URL for the task queue |
| `CELERY_RESULT_BACKEND` | `redis://localhost:6379/1` | Redis URL for task results |

---

## Schedule

The Beat schedule is defined in `celery_app.py`:

```python
celery_app.conf.beat_schedule = {
    "nightly-price-refresh": {
        "task": "app.tasks.price_refresh.refresh_all_prices",
        "schedule": crontab(hour=0, minute=5),  # 00:05 UTC
    },
}
```

To change the time, edit `hour` and `minute` and restart `celery_beat`.

---

## Production notes

1. **Replace `PriceCache` with Redis reads/writes** — the current in-memory
   cache is not shared across multiple API server instances. Use
   `redis-py` directly or a cache library (e.g. `cashews`) to store prices
   in Redis so all replicas see the same data.

2. **Use a real price API** — Yahoo Finance's unofficial endpoint is
   rate-limited and may break without notice. Consider Alpha Vantage,
   Polygon.io, or Finnhub for production workloads.

3. **Persist results to the database** — after each `refresh_price` task,
   write the new price to your `investments` / `positions` table so
   historical price data is retained.

4. **Add Celery Flower authentication** — the monitoring UI has no auth by
   default. Set `FLOWER_BASIC_AUTH=user:password` in production.
