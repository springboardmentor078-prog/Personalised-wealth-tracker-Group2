import asyncio
import os
import sys

# Add backend directory to PYTHONPATH so that 'app' module can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base
from app.models import User, Goal, Investment, Transaction

from sqlalchemy import text

def reset_db():
    print("Dropping all tables...")
    with engine.connect() as conn:
        conn.execute(text("DROP SCHEMA public CASCADE;"))
        conn.execute(text("CREATE SCHEMA public;"))
        conn.commit()
    print("All tables dropped successfully.")
    
    print("Recreating all tables...")
    Base.metadata.create_all(bind=engine)
    print("All tables created successfully.")

if __name__ == "__main__":
    reset_db()
