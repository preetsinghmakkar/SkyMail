from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.utils import constants # or wherever your DB URL is

DATABASE_URL = constants.SQLALCHEMY_DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
