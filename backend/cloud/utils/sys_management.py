from typing import Optional, Dict , Any, List
from fastapi.exceptions import HTTPException
from fastapi import status , UploadFile
from fastapi.encoders import jsonable_encoder
from models.documents import User , Folder
from models.models import StructureCurrentPath
from utils.builder_path import BuilderCloudPath
from pathlib import Path
from utils.security import _env_values
from concurrent.futures import ThreadPoolExecutor
import shutil
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
    def __init__(self , root : str , folder : Folder) -> None:
        self.cloud_builder = (
            BuilderCloudPath(root)
            .build_folder_path(folder)
            )
        self.executor = ThreadPoolExecutor(max_workers=5)

    async def asave_file(self , file : UploadFile , destination : Path):
        loop = asyncio.get_event_loop()
        with open(destination , "wb") as buffer:
            await loop.run_in_executor(self.executor , shutil.copyfileobj , file.file , buffer)

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
    
    async def get_current_level(self , path_on_folder : Optional[Path] = None) -> Dict[str , Any]:
        if path_on_folder is None:
            base_path = self.cloud_builder.current_path
        else:
            base_path = self.cloud_builder.build_path(path_on_folder)
        tree_structure = StructureCurrentPath(current_path=base_path)
        tree_structure.current_items_on_path()
        return jsonable_encoder(tree_structure.current_items)

    async def create_dir(self , name_new_dir : str , path_on_folder : Optional[str] = None) -> None:
        """
            Este metodo cumple el proposito de crear carpetas en el nivel base o anidado del folder asignado 
            al usuario siempre y cuando se pase el path interno necesario con path_folder.
        """
        if path_on_folder is None:
            await self.__run_async_command(f"mkdir -p {str(self.cloud_builder.current_path / name_new_dir)}")
        else:
            path_new_dir = self.cloud_builder.build_path(Path(path_on_folder))
            await self.__run_async_command(f"mkdir -p {str(path_new_dir / name_new_dir)}")

    def upload_file(self, file : UploadFile , path_on_folder  : Optional[Path] = None) -> Dict[str , Any]:
        if path_on_folder is None:
            base_path = self.cloud_builder.current_path
        else:
            base_path = self.cloud_builder.build_path(path_on_folder)

        with open(base_path / file.filename , "wb") as buffer: 
                shutil.copyfileobj(file.file , buffer)

        return {"file" : f"{file.filename}" , "path" : f"{path_on_folder}"}

    async def upload_files(self , files : List[UploadFile] , path_on_folder : Optional[Path] = None) -> Dict[str , Any]:
        copy_tasks = []
        if path_on_folder is None:
            base_path = self.cloud_builder.current_path
        else:
            base_path = self.cloud_builder.build_path(path_on_folder)
        
        for file in files:
            destination_path = base_path / file.filename
            copy_tasks.append(self.asave_file(file , destination_path))
        await asyncio.gather(*copy_tasks)
        return {"load" : "succes" , "files_uploaded" : [file.filename for file in files]}
        
    async def rename_file_or_folder(self , new_name : str, path_on_folder : Optional[str] = None) -> None:
        ...

    def delete_file(self , filename : str , path_folder : Optional[Path] = None) -> Any:
        if path_folder is None:
            base_path = self.cloud_builder.current_path
        else:
            base_path = self.cloud_builder.build_path(path_folder)
        if not (base_path / filename).is_file():
            raise HTTPException(status_code=400 , detail=f"No es un archivo o no se encontró")
        structure = StructureCurrentPath(current_path=base_path)
        structure.current_items_on_path()
        info_file_del = structure.get_file_on_current_path(filename)
        try:
            os.remove(str(base_path / filename))
            return info_file_del
        except PermissionError:
            raise HTTPException(status_code=403 , detail="No posees permisos")
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="El archivo ya ha sido eliminado o no existe")

        
    def delete_folder(self , path_folder : Optional[Path] = None) -> float:
        if path_folder is None:
            raise Exception("Set a folder")
        base_path = self.cloud_builder.build_path(path_folder)
        if not base_path.is_dir():
            raise Exception("This path pointer not folder")
        try:
            structure = StructureCurrentPath(current_path=base_path)
            structure.current_items_on_path()
            shutil.rmtree(str(base_path))
            free_space = sum(item.size for item in structure.current_items)
            return jsonable_encoder({"tree_rm" : structure.current_items, "free" : free_space })
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="El directorio ya ha sido eliminado o no existe")

        except PermissionError:
            raise HTTPException(status_code=403 , detail="No posees permisos")
