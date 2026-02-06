from celery import Celery
from app.settings import Settings

settings = Settings()
celery_app = Celery('{{PROJECT_IDENTIFIER}}', broker=settings.REDIS_URL)