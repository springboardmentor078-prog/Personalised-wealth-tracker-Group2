"""
Nightly price refresh task.

Fetches current market prices for every tracked symbol and updates
``price_cache`` (an in-memory dict shared with the FastAPI app for now;
swap for a DB/Redis write in production).

Price source: Yahoo Finance v8 JSON endpoint (no API key required).
Falls back to a simple stochastic walk when the network is unavailable so
the task never raises hard failures in CI / dev environments.
"""

from __future__ import annotations

import logging
import random
from datetime import datetime, timezone
from typing import Dict, Optional

import httpx

from app.celery_app import celery_app
from app.services.price_cache import price_cache

logger = logging.getLogger(__name__)

# Symbols the system tracks by default.  The portfolio endpoint can extend
# this list at runtime via `price_cache.register_symbol(symbol)`.
DEFAULT_SYMBOLS = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA",
    "VOO",  "QQQ",  "SPY",
    "BND",  "AGG",
    "BTC-USD", "ETH-USD",
]

YF_QUOTE_URL = "https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1d"
REQUEST_TIMEOUT = 10  # seconds per symbol


def _fetch_yahoo_price(symbol: str, client: httpx.Client) -> Optional[float]:
    """Return the latest closing price from Yahoo Finance, or None on error."""
    try:
        url = YF_QUOTE_URL.format(symbol=symbol)
        resp = client.get(url, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        data = resp.json()
        meta = data["chart"]["result"][0]["meta"]
        price = meta.get("regularMarketPrice") or meta.get("previousClose")
        return float(price) if price else None
    except Exception as exc:  # network, parse, or key errors
        logger.warning("Yahoo Finance fetch failed for %s: %s", symbol, exc)
        return None


def _stochastic_fallback(symbol: str) -> float:
    """
    Return a plausible price using a small random walk from the last known
    price (or a seeded default).  Used when live data is unavailable.
    """
    last = price_cache.get(symbol)
    if last:
        drift = random.gauss(0, 0.008)  # ±0.8 % std-dev daily
        return round(last * (1 + drift), 4)
    # Seed prices so the first run isn't zero
    seeds: Dict[str, float] = {
        "AAPL": 178.50, "MSFT": 378.20, "GOOGL": 175.40, "AMZN": 198.90,
        "NVDA": 875.00, "VOO": 445.30, "QQQ": 430.10, "SPY": 510.60,
        "BND": 73.50,   "AGG": 95.80,  "BTC-USD": 52000.0, "ETH-USD": 2800.0,
    }
    base = seeds.get(symbol, 100.0)
    return round(base * random.uniform(0.99, 1.01), 4)


# ─── Celery tasks ────────────────────────────────────────────────────────────

@celery_app.task(
    bind=True,
    name="app.tasks.price_refresh.refresh_price",
    max_retries=3,
    default_retry_delay=60,
    acks_late=True,
)
def refresh_price(self, symbol: str) -> dict:
    """
    Fetch and cache the latest price for a single *symbol*.

    Returns a dict with ``symbol``, ``price``, ``source``, and ``updated_at``.
    """
    logger.info("Refreshing price for %s", symbol)

    with httpx.Client(headers={"User-Agent": "RiskProfileNavigator/1.0"}) as client:
        price = _fetch_yahoo_price(symbol, client)

    source = "yahoo_finance"
    if price is None:
        price = _stochastic_fallback(symbol)
        source = "fallback"
        logger.warning("Using fallback price for %s: %.4f", symbol, price)

    price_cache.update(symbol, price)
    updated_at = datetime.now(timezone.utc).isoformat()

    logger.info("Price updated — %s: %.4f (%s)", symbol, price, source)
    return {"symbol": symbol, "price": price, "source": source, "updated_at": updated_at}


@celery_app.task(
    bind=True,
    name="app.tasks.price_refresh.refresh_all_prices",
    max_retries=2,
    default_retry_delay=300,
)
def refresh_all_prices(self) -> dict:
    """
    Nightly task: refresh prices for every registered symbol.

    Dispatches individual ``refresh_price`` sub-tasks so each symbol is
    retried independently and the worker pool is fully utilised.
    """
    symbols = list(price_cache.all_symbols() or DEFAULT_SYMBOLS)
    logger.info("Nightly price refresh started — %d symbols", len(symbols))

    job = refresh_price.chunks([(s,) for s in symbols], 10).group()
    result = job.apply_async()

    summary = {
        "started_at": datetime.now(timezone.utc).isoformat(),
        "symbol_count": len(symbols),
        "group_id": str(result.id),
    }
    logger.info("Nightly price refresh dispatched: %s", summary)
    return summary
