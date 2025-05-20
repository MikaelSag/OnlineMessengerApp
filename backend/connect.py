from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


"""
Fill in [Password] with the password you gave MySQL when downloading
"""

DATABASE_URL = "mysql+pymysql://root:Yokid0463!@localhost/database_project"  # Replace with your database credentials

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def test_connection():
    try:
        db = SessionLocal()
        # Parameterized query example
        query = text("SELECT * FROM users WHERE username = :username")
        parameters = {"username": "test_user"}  # Replace with the actual username you are searching for
        result = db.execute(query, parameters).fetchall()
        
        print("Query result:", result)
    except Exception as e:
        print("Database connection failed:", e)
    finally:
        db.close()


def get_db_connection():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

if __name__ == "__main__":
    test_connection()
