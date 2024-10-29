from fastapi import APIRouter, Depends, status
from fastapi import Request
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from models.documents import User , Folder, PendingShared
from models.db import engine
from utils.security import _env_values
from beanie import init_beanie
from models.models import NewAccount, EventCredentials
from typing import Annotated
from datetime import timedelta, datetime, timezone
from secrets import token_hex
from uuid import uuid4
import asyncio

webhook_router = APIRouter(prefix="/webhooks")
auth_transaction_for = dict()

async def start_session_db():
    db = init_beanie(database=engine["cloud_db"] , document_models=[User , Folder , PendingShared])
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
    #Validamos que ese usuario ya no se encuentre registrado
    #Registramos una instancia de la carpeta root y del usuario sin guardar en bd
    new_root_folder = Folder(
        limit_capacity=new_account.limit_memory , 
        current_capacity=0 , 
        unity_memory=new_account.unity_memory, 
        plan_name=new_account.plan_name
        )
    new_user = User(
        username=new_account.username , 
        nombre=new_account.name,
        folder=new_root_folder
        )
    #Creamos la carpeta en el sistema
    #Todo: Se debe limitar el espacio de la carpeta creada acorde a el plan seleccionado por el usuario
    proc_root = await asyncio.create_subprocess_shell(
        cmd=f"mkdir {_env_values.ROOT_CLOUD_PATH}/{str(new_root_folder.folder_name)}",
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    stdout , stderr = await proc_root.communicate()
    if stderr:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT , detail={"reason" : "err on create dir"})
    symlink_folder = await asyncio.create_subprocess_shell(
        cmd=f"mkdir -p {_env_values.ROOT_CLOUD_PATH}/{str(new_root_folder.folder_name)}/.symlinks "
    )
    #Si no hay error en la carpeta raiz configurada guardamos el usuario y el folder en la base de datos.
    proc_transfer = await asyncio.create_subprocess_shell(
        cmd=f"mkdir {_env_values.ROOT_TRANSFER_PATH}/{str(new_root_folder.shared_folder)}"    
    )
    stdout , stderr = await proc_transfer.communicate()
    if stderr:
        del_cloud_path = await asyncio.create_subprocess_shell(cmd=f"rm -rf {_env_values.ROOT_CLOUD_PATH}/{str(new_root_folder.folder_name)}")
        await del_cloud_path.communicate() #Eliminamos la carpeta de cloud_root debido a que no se hizo correctamente toda la configuración
        raise HTTPException(status_code=status.HTTP_409_CONFLICT , detail={"reason" : "err on create shared dir"})
    await new_root_folder.save()
    await new_user.save()
    return JSONResponse(content={"operation" : "success"}, status_code=status.HTTP_201_CREATED)

