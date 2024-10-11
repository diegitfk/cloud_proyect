from typing import Optional
from fastapi.exceptions import HTTPException
from fastapi import status
from models.documents import User , Folder
from pathlib import Path
from utils.security import _env_values
import asyncio
import os
class ComandError(Exception):
    def __init__(self, message : str) -> None:
        self.message = message
        super().__init__(self.message)
    def __str__(self) -> str:
        return f"[Error]: {self.message}"
class NotConstructBasePath(Exception):
    def __init__(self, message : str) -> None:
        self.message = message
        super().__init__(self.message)
    def __str__(self) -> str:
        return f"[Error]: {self.message}"


class SysManagement:
    def __init__(self) -> None:
        self.base_path : Optional[str] = None  #/cloud_root/uuid_folder
    def construct_base_path(self , folder : Folder , dir_inside_folder : Optional[str] = None) -> None:
        """
            Este metodo es el encargo de recibir el folder al usuario y un ruta interna dentro del folder optional
            en caso de ser None, construye el path raiz que deberia consumir el usuario osea /cloud_project/uuid_folder
            en caso de no ser None, construye /cloud_root/uuid_folder/path/to/dir
        """
        self.base_path = None
        if dir_inside_folder is None:
            self.base_path = "/".join([_env_values.ROOT_CLOUD_PATH , str(folder.folder_name)])
        else:
            path_dirs = dir_inside_folder.strip("/").split("/")
            path_dirs.insert(0 , str(folder.folder_name))
            path_dirs.insert(0 , _env_values.ROOT_CLOUD_PATH)
            self.base_path = "/".join(path_dirs)

    async def __run_async_command(self , comand : str) -> bytes:
        """
            Este comando ejecuta comandos asincronicamente sobre el sistema de archivos del docker.
        """
        process = await asyncio.create_subprocess_shell(
            cmd=comand,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        output , error = await process.communicate()
        if error:
            print(f"[Err-Log]: {error.decode()}")
            raise ComandError("Error in executing command")
        if output:
            print(f"[Out-Log]: {output.decode()}")
        return output
        
    async def create_dir(self , folder : Folder ,name_dir : str , path_folder : Optional[str] = None) -> None:
        """
            Este metodo cumple el proposito de crear carpetas en el nivel base o anidado del folder asignado 
            al usuario siempre y cuando se pase el path interno necesario con path_folder.
        """
        self.construct_base_path(folder=folder , dir_inside_folder=path_folder)
        if not os.path.isdir(self.base_path):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT , detail={"reason" : "The path is not dir"})
        path_new_dir = self.base_path + "/" + name_dir
        if self.base_path is None:
            raise NotConstructBasePath("you are not call the construct_base_path method")
        await self.__run_async_command(f"mkdir {path_new_dir}")
    async def rename_file_or_folder(self , folder : Folder , new_name : str, path_folder : Optional[str] = None) -> None:
        """
            Este metodo es el encargado de cambiar el nombre de un archivo o de una carpeta.
        """
        self.construct_base_path(folder=folder , dir_inside_folder=path_folder)
        if not os.path.isfile(self.base_path) or os.path.isdir(self.base_path):
            print("No es ni archivo ni carpeta")
        if os.path.isfile(self.base_path):
            path = Path(self.base_path)
            ext_file = path.suffix
            new_path_name_file = self.base_path.strip("/").split("/") # [cloud_root , uuid_four , to , dir , file_name1]
            new_path_name_file.pop() # [cloud_root , uuid_four , to , dir]
            new_path_name_file.append(new_name + ext_file)# [cloud_root , uuid_four , to , dir , new_file_name]
            rename_path = "/" + "/".join(new_path_name_file)
            print(f"Renombre archivo comando: mv {self.base_path} {rename_path} ")
            await self.__run_async_command(f"mv {self.base_path} {rename_path}")
        if os.path.isdir(self.base_path):
            new_path_name_folder = self.base_path.strip("/").split("/") # [cloud_root , uuid_four , to , dir , old_dir_name]
            new_path_name_folder.pop() # [cloud_root , uuid_four , to , dir]
            new_path_name_folder.append(new_name)# [cloud_root , uuid_four , to , dir , new_dir_name]
            rename_path = "/" + "/".join(new_path_name_folder)
            print(f"Renombre carpeta comando: mv {self.base_path} {rename_path} ")
            await self.__run_async_command(f"mv {self.base_path} {rename_path}")

        

        
        
    async def delete_file():
        ...
    async def delete_folder():
        ...
    async def share_file_or_folder():
        ...
    
        
        