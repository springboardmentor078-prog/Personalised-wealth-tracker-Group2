"""
Price-refresh endpoints
=======================
GET  /api/v1/prices/                    – full cache snapshot
GET  /api/v1/prices/{symbol}            – single symbol
POST /api/v1/prices/refresh             – trigger refresh for specific symbols
POST /api/v1/prices/refresh/all         – trigger the nightly job on-demand
GET  /api/v1/prices/refresh/{task_id}   – poll task status
"""

from __future__ import annotations

from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.services.price_cache import price_cache
from app.tasks.price_refresh import refresh_all_prices, refresh_price

router = APIRouter()


# ── Schemas ──────────────────────────────────────────────────────────────────

class PriceEntry(BaseModel):
    symbol: str
    price: float
    updated_at: Optional[str] = None


class RefreshRequest(BaseModel):
    symbols: List[str]


class TaskResponse(BaseModel):
    task_id: str
    status: str
    message: str


class AllRefreshResponse(BaseModel):
    group_id: str
    symbol_count: int
    started_at: str
    message: str


# ── Routes ───────────────────────────────────────────────────────────────────

@router.get(
    "/",
    response_model=Dict[str, PriceEntry],
    summary="Get all cached prices",
    description="Returns the full in-memory price snapshot from the last nightly refresh.",
)
async def get_all_prices():
    snapshot = price_cache.snapshot()
    return {
        sym: PriceEntry(symbol=sym, price=data["price"], updated_at=data.get("updated_at"))
        for sym, data in snapshot.items()
    }


@router.get(
    "/{symbol}",
    response_model=PriceEntry,
    summary="Get cached price for a symbol",
)
async def get_price(symbol: str):
    entry = price_cache.get_with_meta(symbol.upper())
    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No cached price for symbol '{symbol.upper()}'. "
                   "Trigger a refresh or wait for the nightly job.",
        )
    return PriceEntry(**entry)


@router.post(
    "/refresh",
    response_model=List[TaskResponse],
    status_code=status.HTTP_202_ACCEPTED,
    summary="Trigger price refresh for given symbols",
    description="Dispatches an async Celery task for each requested symbol.",
)
async def trigger_refresh(body: RefreshRequest):
    if not body.symbols:
        raise HTTPException(status_code=400, detail="symbols list must not be empty")

    responses = []
    for sym in body.symbols:
        task = refresh_price.delay(sym.upper())
        # Register so future nightly refreshes include it
        price_cache.register_symbol(sym.upper())
        responses.append(
            TaskResponse(
                task_id=task.id,
                status="PENDING",
                message=f"Refresh queued for {sym.upper()}",
            )
        )
    return responses


@router.post(
    "/refresh/all",
    response_model=AllRefreshResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Trigger nightly price refresh on-demand",
    description="Runs the same job as the nightly Celery Beat schedule immediately.",
)
async def trigger_refresh_all():
    task = refresh_all_prices.delay()
    result = task.get(timeout=5, propagate=False)  # brief wait for the dispatch summary
    if isinstance(result, dict):
        return AllRefreshResponse(
            group_id=result.get("group_id", task.id),
            symbol_count=result.get("symbol_count", 0),
            started_at=result.get("started_at", ""),
            message="Nightly price refresh dispatched successfully.",
        )
    return AllRefreshResponse(
        group_id=task.id,
        symbol_count=0,
        started_at="",
        message="Refresh task accepted; result pending.",
    )


@router.get(
    "/refresh/{task_id}",
    response_model=TaskResponse,
    summary="Poll price-refresh task status",
)
async def get_task_status(task_id: str):
    from celery.result import AsyncResult
    from app.celery_app import celery_app

    result = AsyncResult(task_id, app=celery_app)
    return TaskResponse(
        task_id=task_id,
        status=result.status,
        message=str(result.result) if result.ready() else "Task is still running.",
    )
