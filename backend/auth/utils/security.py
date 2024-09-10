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
import httpx
class Env(BaseModel):
    EMPLOYEE_SECRET_KEY : str
    ALGORITHM_JWT : str 
    EXPIRE_TOKEN_MINUTES : int
    WEBHOOK_START_TRANSACTION : str
    WEBHOOK_NEW_ACCOUNT_URL : str

class TokenData(BaseModel):
    """
    Este objeto pydantic demuestra es basicamente el payload del JSON WEB TOKEN a
    codificar bajo la llave secreta.
    """
    username : str 
    name : str
    last_name : str
    exp : Annotated[Optional[timedelta] , Field(default=None)]

class Token(BaseModel):
    """
    Respuesta correcta bajo el estandar de retorno del JSON WEB TOKEN
    """
    access_token : str
    token_type : Annotated[str , Field(default="bearer")]

class SecurityFlow:
    def __init__(self , hash_schema : str) -> None:
        self.context = CryptContext(schemes=[hash_schema])
    def crypt_password(self , plain_password : str) -> str:
        return self.context.hash(plain_password)
    def verify_hash(self , plain_password : str , hash_password : str) -> bool:
        return self.context.verify(plain_password , hash_password)

_env_values : Env = Env(**dotenv_values("./.env"))

class JwtFlow:
    @staticmethod
    def generate_token(payload : TokenData , expire_token_on : Optional[timedelta] = None) -> Token:
        if not expire_token_on is None:
            payload.exp = datetime.now(timezone.utc) + expire_token_on
        else:
            payload.exp = datetime.now(timezone.utc) + timedelta(minutes=_env_values.EXPIRE_TOKEN_MINUTES)
        token_jwt = jwt.encode(payload=payload.model_dump(exclude_none=True) , key=_env_values.EMPLOYEE_SECRET_KEY , algorithm=_env_values.ALGORITHM_JWT)
        return Token(access_token=token_jwt)
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
