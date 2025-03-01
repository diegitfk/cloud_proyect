from pydantic import BaseModel , EmailStr, Field
from typing import Annotated , List , Dict, Optional
from models.documents import TypePlan
from enum import StrEnum

class UserSign(BaseModel):
    username : Annotated[str , Field(max_length=20)]
    nombre : Annotated[str , Field(max_length=20)]
    apellido : Annotated[str , Field(max_length=20)]
    email : EmailStr
    password : str
    plan : TypePlan

class UserLogin(BaseModel):
    email : EmailStr
    password : str 

class NewAccount(BaseModel):
    username : str
    plan_name : TypePlan
    limit_memory : int
    unity_memory : str
    name : str 
      
class CredentialsTransaction(BaseModel):
    id_transaction : str
    api_key : str