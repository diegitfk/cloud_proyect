from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pymongo import MongoClient
import os

# Recupera la URL de MongoDB desde las variables de entorno
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017")

# Crea la conexión a la base de datos
client = MongoClient(mongo_url)
app = FastAPI()
@app.get("/")
async def home():
    print("Hola Mundo ....")
    return JSONResponse(content={'Hola' : client.address})