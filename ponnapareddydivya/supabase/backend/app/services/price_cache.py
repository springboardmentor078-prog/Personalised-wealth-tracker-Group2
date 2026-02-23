"""
price_cache.py
~~~~~~~~~~~~~~
Thread-safe in-memory price store shared between the FastAPI app and Celery
workers (when running in the same process or via shared Redis backend).

In production, replace the in-memory dict with direct Redis reads/writes so
that multiple worker processes and the API server see consistent data.
"""

from __future__ import annotations

import threading
from datetime import datetime, timezone
from typing import Dict, Optional, Set


class PriceCache:
    """
    Simple thread-safe mapping of ``symbol → price`` with metadata.

    Attributes
    ----------
    _prices:   symbol → latest float price
    _updated:  symbol → ISO-8601 timestamp of last update
    _symbols:  set of all registered symbols
    """

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._prices: Dict[str, float] = {}
        self._updated: Dict[str, str] = {}
        self._symbols: Set[str] = set()

    # ── Read ────────────────────────────────────────────────────────────────

    def get(self, symbol: str) -> Optional[float]:
        """Return the cached price for *symbol*, or ``None`` if unknown."""
        with self._lock:
            return self._prices.get(symbol.upper())

    def get_with_meta(self, symbol: str) -> Optional[dict]:
        """Return ``{symbol, price, updated_at}`` or ``None``."""
        sym = symbol.upper()
        with self._lock:
            price = self._prices.get(sym)
            if price is None:
                return None
            return {
                "symbol": sym,
                "price": price,
                "updated_at": self._updated.get(sym),
            }

    def snapshot(self) -> Dict[str, dict]:
        """Return a copy of the entire cache as ``{symbol: {price, updated_at}}``."""
        with self._lock:
            return {
                sym: {"price": self._prices[sym], "updated_at": self._updated.get(sym)}
                for sym in self._symbols
                if sym in self._prices
            }

    def all_symbols(self) -> Set[str]:
        """Return the set of all registered symbols."""
        with self._lock:
            return set(self._symbols)

    # ── Write ───────────────────────────────────────────────────────────────

    def update(self, symbol: str, price: float) -> None:
        """Store *price* for *symbol* and record the update timestamp."""
        sym = symbol.upper()
        now = datetime.now(timezone.utc).isoformat()
        with self._lock:
            self._prices[sym] = price
            self._updated[sym] = now
            self._symbols.add(sym)

    def register_symbol(self, symbol: str) -> None:
        """Register *symbol* so it will be included in nightly refreshes."""
        with self._lock:
            self._symbols.add(symbol.upper())

    def bulk_update(self, updates: Dict[str, float]) -> None:
        """Apply multiple ``{symbol: price}`` updates atomically."""
        now = datetime.now(timezone.utc).isoformat()
        with self._lock:
            for symbol, price in updates.items():
                sym = symbol.upper()
                self._prices[sym] = price
                self._updated[sym] = now
                self._symbols.add(sym)


# Module-level singleton shared across the application
price_cache = PriceCache()
