from passlib.context import CryptContext
from typing import Dict, Any
from fastapi import status , Depends, Request , status, Cookie
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse , Response
from typing import Optional, Annotated
from datetime import timezone , datetime , timedelta
from pydantic import BaseModel, Field, HttpUrl
from dotenv import dotenv_values
import jwt

class Env(BaseModel):
    EMPLOYEE_SECRET_KEY : str
    ALGORITHM_JWT : str 
    EXPIRE_TOKEN_MINUTES : int
    ROOT_CLOUD_PATH : str
    ROOT_TRANSFER_PATH : str

class TokenData(BaseModel):
    """
    Este objeto pydantic demuestra es basicamente el payload del JSON WEB TOKEN a
    codificar bajo la llave secreta.
    """
    username : str 
    name : str
    last_name : str
    exp : Annotated[Optional[timedelta] , Field(default=None)]

_env_values : Env = Env(**dotenv_values("./.env"))
class JwtFlow:
        #Codificamos el token con el payload respectivo bajo el algoritmo y la llave secreta.
    async def __call__(self , response : Response , session_jwt : Annotated[Optional[str] , Cookie(...)] = None) -> TokenData:
        if session_jwt is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail="Your not authorizate")
        try:
            payload = jwt.decode(session_jwt , _env_values.EMPLOYEE_SECRET_KEY , _env_values.ALGORITHM_JWT)   
            return TokenData(**payload)
        except jwt.DecodeError:
            raise   
        except jwt.ExpiredSignatureError:
            raise
