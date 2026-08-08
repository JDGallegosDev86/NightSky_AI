from sqlalchemy import Column, Integer, String, Float, Boolean
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True, index=True, nullable=False)

    hashed_password = Column(String, nullable=False)

class Upload(Base):
    __tablename__ = "uploads"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String)
    filename = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(String)
    bortle_prediction = Column(String, nullable=True)
    shared_publicly = Column(Boolean, default=False)