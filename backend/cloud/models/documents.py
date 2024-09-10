from beanie import Document , Indexed, Link, BackLink, before_event, Update
from pydantic import Field , BaseModel, UUID4
from typing import List , Dict , Literal, Annotated, Optional
from datetime import datetime , timezone
from uuid import uuid4

class User(Document):
    username : Annotated[str , Field(max_length=20) , Indexed(unique=True)]
    nombre : Annotated[str , Field(max_length=20)]
    created_at : Annotated[datetime , Field(default_factory=datetime.now)]
    updated_at : Optional[datetime] = Field(default=None)
    folder : Link["Folder"]

    @before_event(Update)
    def updated_at_up(self):
        self.updated_at = datetime.now(timezone.utc)
        
    class Settings:
        name="users"

class Folder(Document):
    folder_name : Annotated[UUID4 , Field(default_factory=uuid4) , Indexed(unique=True)]
    limit_capacity : int
    current_capacity : int
    unity_memory : Literal["MB" , "GB"]
    plan_name : Literal["basic" , "medium" , "pro"]
    owner : BackLink[User] = Field(original_field="folder")
    created_at : Annotated[datetime , Field(default_factory=datetime.now)]
    updated_at : Optional[datetime] = Field(default=None)

    @before_event(Update)
    def updated_at_up(self):
        self.updated_at = datetime.now(timezone.utc)

    class Settings:
        name="folders"





