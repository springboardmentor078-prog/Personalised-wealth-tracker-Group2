from celery import Celery
from celery.schedules import crontab
from app.core.config import settings

celery_app = Celery(
    "risk_profile_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.tasks.price_refresh"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)

# ─── Beat schedule: nightly price refresh ───────────────────────────────────
celery_app.conf.beat_schedule = {
    "nightly-price-refresh": {
        "task": "app.tasks.price_refresh.refresh_all_prices",
        "schedule": crontab(hour=0, minute=5),  # 00:05 UTC every night
        "options": {"expires": 3600},
    },
}
