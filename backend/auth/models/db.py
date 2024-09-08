from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os 
url_db = os.getenv("MONGO_URL")
if url_db is None:
    raise Exception("No existe una URL para mongo db")
engine = AsyncIOMotorClient(url_db)