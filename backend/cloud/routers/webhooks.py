from fastapi import APIRouter, Depends, status
from fastapi import Request
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from models.documents import User , Folder
from models.db import engine
from beanie import init_beanie
from models.models import NewAccount, EventCredentials
from typing import Annotated
from datetime import timedelta, datetime, timezone
from secrets import token_hex
from uuid import uuid4

webhook_router = APIRouter(prefix="/webhooks")
auth_transaction_for = dict()

async def start_session_db():
    db = init_beanie(database=engine["cloud_db"] , document_models=[User , Folder])
    try:
        yield await db
    finally:
        db.close()

def verify_credentials_transaction(request : Request) -> EventCredentials:
    host = request.client.host #En caso de que genere problemas esta variable hacer uso del encabezado X-Forwarded-For
    api_key = request.headers.get("X-Signature")
    id_transaction = request.headers.get("X-Transaction")
    if api_key is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail={"X-Signature" : "Nothing"})
    if id_transaction is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail={"X-Transaction" : "Nothing"})
    payload_transaction = auth_transaction_for.get(id_transaction)
    if payload_transaction is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Not exist transaction")
    if not payload_transaction.get("api_key") == api_key and payload_transaction.get("owner") == host:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="UnAuthorizated Origin")
    if datetime.now(timezone.utc) > payload_transaction.get("exp"):
        auth_transaction_for.pop(id_transaction)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Expire Time Transaction")
    return EventCredentials(id=id_transaction , api_key=api_key , host=host)

@webhook_router.get("/register_webhook")
async def key_for_emisor(request : Request):
    api_key = token_hex(16)
    id_transaction = str(uuid4())
    auth_transaction_for[id_transaction] = {
        "api_key" : api_key , 
        "exp" : datetime.now(timezone.utc) + timedelta(minutes=3),  
        "owner" : request.client.host
        }
    return JSONResponse(content={"api_key" : api_key , "id_transaction" : str(id_transaction)} , status_code=status.HTTP_200_OK)

@webhook_router.post("/configure_dir_account")
async def config_new_account(new_account : NewAccount , transaction_credentials : Annotated[EventCredentials , Depends(verify_credentials_transaction)] , session_db = Depends(start_session_db)):
    print(new_account)
    #Creamos la carpeta en el sistema
    #Insertamos metadatos de la carpeta mediante Folders
    return JSONResponse(content={"operation" : "success"}, status_code=status.HTTP_201_CREATED)

