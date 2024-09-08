from enum import StrEnum
from typing import List
from pydantic import BaseModel , Field
import os
import time
## Estructuramiento de JSON de Directorios
class ItemType(StrEnum):
    DIRECTORY = 'directory'
    FILE = 'file'

class ItemFileSystem(BaseModel):
    name : str
    type : ItemType
    size : float
    created_at : str

class StructureCurrentPath(BaseModel):
    current_path : str
    current_items : List[ItemFileSystem] = Field(default=[])
    
    def current_items_on_path(self) -> List[ItemFileSystem]:
        self.current_items = []
        if not os.path.isdir(self.current_path):
            print("error")
        list_items = os.listdir(self.current_path)
        for item in list_items:
            path_item_on_root_path = self.current_path + "/" + item
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