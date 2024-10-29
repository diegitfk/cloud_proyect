from enum import StrEnum
from typing import List, Optional, Literal, Annotated
from pydantic import BaseModel , Field , EmailStr
from fastapi import Form, UploadFile
from pathlib import Path
import os
import time
## Estructuramiento de JSON de Directorios
class ItemType(StrEnum):
    DIRECTORY = 'folder'
    FILE = 'file'

class StateShare(StrEnum):
    PENDING = "pendiente"
    ACCEPTED = "aceptada"
    REJECTED = "rechazada"

class ItemFileSystem(BaseModel):
    name : str
    type : ItemType
    size : float
    created_at : str

class StructureCurrentPath(BaseModel):
    """
        Esta es una clase encargada de retornar el nivel actual acorde a una ruta siempre y cuando
        el current_path sea una carpeta en el sistema.

        ```python
            from pathlib import Path
            structure = StructureCurrentPath()
            path_to_diego = Path("/cloud_root/diego_cancino")
            structure.current_path = path
            current_items = structure.current_items_on_path()
        ```
    """
    current_path : Optional[Path] = Field(default=None)
    current_items : List[ItemFileSystem] = Field(default=[])
    
    def current_items_on_path(self) -> List[ItemFileSystem]:
        self.current_items = []
        if not self.current_path.is_dir():
            raise Exception("Error el path actual no es un carpeta")
        list_items = os.listdir(self.current_path)
        for item in list_items:
            if item.startswith("."):
                continue
            path_item_on_root_path = self.current_path / item
            item_stat = os.stat(path_item_on_root_path)
            name = os.path.basename(path_item_on_root_path)
            created_at = time.ctime(item_stat.st_ctime)
            size = os.path.getsize(path_item_on_root_path)
            if size != 0:
                    conv_size_to_mb = size / (1024)
                    size = round(conv_size_to_mb , 4)
            if os.path.isdir(path_item_on_root_path):
                self.current_items.append(ItemFileSystem(name=name , type=ItemType.DIRECTORY , created_at=created_at , size=size))
            else:
                self.current_items.append(ItemFileSystem(name=name , type=ItemType.FILE , created_at=created_at , size=size))  
    
    def get_file_on_current_path(self , filename : str) -> ItemFileSystem:
        if len(self.current_items) == 0:
            raise Exception("Not exists this file in the path")
        return next(filter(lambda file : file.name == filename , self.current_items))

    def reset_current_path(self):
        self.current_path = None

class NewAccount(BaseModel):
    username : str
    plan_name : Literal['basic' , 'medium' , 'pro']
    limit_memory : int
    unity_memory : str
    name : str  
    
class EventCredentials(BaseModel):
    id : str
    api_key : str
    host : str
# Models Para el Crud de Carpetas

class CreateDir(BaseModel):
    name_dir : Annotated[str , Field(...)]
    path_on_folder : Annotated[Optional[Path] , Field(default=None)] = None

class PathOperation(BaseModel):
    path_on_folder : Annotated[Optional[Path] , Field(default=None)] = None

# Models para compartir archivos
    
class ShareResourceRequest(BaseModel):
    name : str
    path : Path
    to : Annotated[str , Field(description="Este es el nombre de usuario que recibira los recursos")]
