from pydantic import BaseModel , Field ,EmailStr
from typing import Annotated, List, Optional
from beanie import Document , Link, BackLink , Indexed, Update, before_event, init_beanie, WriteRules , PydanticObjectId
from datetime import datetime
from enum import StrEnum
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
"""
    User -- 1 : 1 -- Plan
"""

class UnityMemory(StrEnum):
    MEGABYTES = "MB"
    GIGABYTES = "GB"

class TypePlan(StrEnum):
    BASIC = "basic"
    MEDIUM = "medium"
    PRO = "pro"

class User(Document):
    username : Annotated[str , Field(max_length=20) , Indexed(unique=True)]
    nombre : Annotated[str , Field(max_length=20)]
    apellido : Annotated[str , Field(max_length=20)]
    email : Annotated[EmailStr , Indexed(unique=True)]
    password : str
    created_at : Annotated[datetime , Field(default_factory=datetime.now)]
    updated_at : Optional[datetime] = Field(default=None)
    plan : Optional[Link['Plan']] = None #Tiene registrado un plan

    @before_event(Update)
    def updated_at_up(self):
        self.updated_at = datetime.now()
    def __str__(self) -> str:
        return f"username : {self.username} nombre : {self.nombre + " " + self.apellido} email : {self.email} password : {self.password}"

    class Settings:
        name = "users"

class Plan(Document):
    type : Annotated[TypePlan , Indexed(unique=True)]
    unity_memory : Annotated[UnityMemory , Field(max_length=2)]
    limit_memory : int
    users_subs : Optional[List[BackLink[User]]] = Field(original_field="plan") #Puede o no haber usuarios suscritos a una subcripcion
    created_at : Annotated[datetime , Field(default_factory=datetime.now)]
    updated_at : Optional[datetime] = Field(default=None)

    @before_event(Update)
    def updated_at_up(self):
        self.updated_at = datetime.now()

    class Settings:
        name = "plans"

async def main():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    #engine_db = await init_beanie(client["auth_db"] , document_models=[User , Plan])
    #plan_basic = Plan(type="basic" , unity_memory="MB" , limit_memory=100)
    #await plan_basic.insert()
#if __name__ == "__main__":
    #asyncio.run(main())