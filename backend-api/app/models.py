from sqlalchemy import Column, Integer, String, Float
from app.database import Base


class Upload(Base):
    __tablename__ = "uploads"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String)
    filename = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(String)
    bortle_prediction = Column(String, nullable=True)