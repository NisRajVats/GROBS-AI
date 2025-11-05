from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. This is the path to our database file.
# It will create a file named 'grobs.db' in your 'backend' folder.
SQLALCHEMY_DATABASE_URL = "sqlite:///./grobs.db"

# 2. This is the "engine" that connects SQLAlchemy to the database.
# The 'check_same_thread' argument is needed only for SQLite.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. This is what we'll use to create database "sessions" (i.e., conversations).
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. This is a "base class" our User model will inherit from.
Base = declarative_base()

# A helper function to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()