from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.settings import Settings

settings = Settings()
engine = create_engine(settings.DATABASE_URL, future=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()