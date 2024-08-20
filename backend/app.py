from fastapi import FastAPI, Form, UploadFile, Path, Query
from dotenv import dotenv_values
from passlib.context import CryptContext
from typing import Annotated
import jwt
import zipfile
import subprocess

"""
    ### Finalidad de este archivo
    Contiene todos los controladores y puntos finales de la api, para el login, 
    este modulo es el cuerpo principal del servicio /account
"""
app = FastAPI()
ctx = CryptContext(schemes=["sha256_crypt"])
@app.post("/create_user")
async def register_user() -> None:
    """
        #### Descripción de funcionalidad
        Ruta a la cual llegarán las solicitudes cuando los nuevo clientes enviarán datos a la api
        desde el frontend para registrarlos en la base de datos de la app
        ##### La etapas para crear un usuario deberián ser las siguientes
        1._ Registrar al usuario en la base de datos
        2._ Registrar al usuario en el sistema operativo de la maquina 
        este paso se divide en los siguientes sub pasos
            - 
    """
    ...
@app.post("/login")
async def login() -> None:
    """
        #### Descripción de funcionalidad
        Ruta a la cual llegarán las solicitudes para hacer login a la app
        esto con la finalidad de verificar el acceso y entregar tokens con tiempo 
        de expiración   
    """
    ...

@app.post("/create_dir/{name_dir}")
async def creating_a_dir(name_dir : Annotated[str , Path(...)]) -> None:
    result = subprocess.run(["mkdir" , f"/test_extract/{name_dir}"] , capture_output=True, text=True)
    print(result.stdout , result.stderr)

@app.post("/upload_files")
async def received_files(files : UploadFile) -> None:
    with zipfile.ZipFile(files.file , 'r') as zip_ref:
        zip_ref.extractall("/test_extract")