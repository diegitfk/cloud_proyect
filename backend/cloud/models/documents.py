from beanie import Document , Indexed, Link, BackLink, before_event, Update, PydanticObjectId
from pydantic import Field , BaseModel, UUID4
from typing import List , Dict , Literal, Annotated, Optional , Any
from datetime import datetime , timezone
from models.models import StateShare
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
    # Este es el nombre del folder en el cloud_root
    shared_folder : Annotated[UUID4 , Field(default_factory=uuid4) , Indexed(unique=True)] # Estes es el nombre del folder en cloud_transfer
    limit_capacity : int
    current_capacity : float
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

class PendingShared(Document):
    """
        Esta es una colección que posee solicitudes de de transferencia de archivos
        con tiempo de expiración de enlaces simbolicos en el sistema de archivos.
        en esta se recibiran las llaves del emisor receptor , etc.
    """
    emisor : Link["User"] #Usuario que reparte el recurso
    receptor : Link["User"] #Usuario que recibira el recurso si lo acepta o no
    name : str
    type : Literal["file" , "folder"] #Tipo de recurso
    key_resource : Annotated[Optional[UUID4] , Field(default=None)] = None #El attr ext del recurso
    space : float #El espacio del recurso a compartir
    linksimb : Annotated[Optional[UUID4] , Field(default=None)] = None #El enlace simbolico asociado a la transferencia    
    state : str #El estado de la transaccion 'PENDING' , 'ACCEPT' , 'REJECT'
    exp : datetime #Tiempo de expiración de los recursos.
    created_at : Annotated[datetime , Field(default_factory=datetime.now)]
    
    class Settings:
        name = "transfers"    

class UserView(BaseModel):
    username : str
    nombre : str
        
class PendingShareView(BaseModel):
    id : PydanticObjectId = Field(alias="_id")
    emisor : UserView
    name : str
    type : str
    space : float
    state : str 
