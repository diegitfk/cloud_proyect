from fastapi import FastAPI, Form, UploadFile, Path, Query , Request , status , Response ,Depends
from routers.webhooks import webhook_router, start_session_db
from dotenv import dotenv_values
from utils.sys_management import SysManagement
from models.documents import User , Folder
from jwt import DecodeError , ExpiredSignatureError
from utils.security import JwtFlow , TokenData
from typing import Annotated, Optional
import jwt
import zipfile

"""
    ### Finalidad de este archivo
    Contiene todos los controladores y puntos finales de la api, para el login, 
    este modulo es el cuerpo principal del servicio /account
"""
auth_schema = JwtFlow()
app = FastAPI(root_path="/cloud")
app.include_router(webhook_router)
#Errores de validacion del token que finalizaran la sesion de la cookie
@app.exception_handler(DecodeError)
async def invalid_token_finish_session(req : Request , exc : DecodeError):
    response = Response(content="This token is invalid" , status_code=status.HTTP_401_UNAUTHORIZED)
    response.delete_cookie("session_jwt")
    return response

@app.exception_handler(ExpiredSignatureError)
async def expire_token_finish_session(req : Request , exc : ExpiredSignatureError):
    response = Response(content="Expire token" , status_code=status.HTTP_401_UNAUTHORIZED)
    response.delete_cookie("session_jwt")
    return response

@app.post("/rename_dir/{new_name_dir}")
async def rename_dir(
        new_name_dir : Annotated[str , Path(...)] , 
        token : Annotated[TokenData , Depends(auth_schema)] , 
        deep_path : Annotated[Optional[str] , Query(...)] = None , 
        session_db = Depends(start_session_db)
    ) -> None:

    user = await User.find_one( User.username == token.username, fetch_links=True)
    sys_manager = SysManagement()
    await sys_manager.rename_file_or_folder(folder=user.folder , new_name=new_name_dir , path_folder=deep_path)

@app.post("/create_dir/{name_dir}")
async def creating_a_dir(
        name_dir : Annotated[str , Path(...)] , 
        token : Annotated[TokenData , Depends(auth_schema)] , 
        deep_path : Annotated[Optional[str] , Query(...)] = None , 
        session_db = Depends(start_session_db)
    ) -> None:
    
    user = await User.find_one( User.username == token.username, fetch_links=True)
    sys_manager = SysManagement()
    await sys_manager.create_dir(folder=user.folder , name_dir=name_dir , path_folder=deep_path)

@app.post("/upload_files")
async def received_files(files : list[UploadFile]) -> None:
    with zipfile.ZipFile(files.file , 'r') as zip_ref:
        zip_ref.extractall("/test_extract")