from typing import Optional, Dict , Any, List
from fastapi.exceptions import HTTPException
from fastapi import status , UploadFile
from fastapi.encoders import jsonable_encoder
from models.documents import User , Folder, PendingShared
from models.models import StructureCurrentPath, StateShare
from utils.builder_path import BuilderCloudPath , BuilderTransferPath
from pathlib import Path
from utils.security import _env_values
from concurrent.futures import ThreadPoolExecutor
import subprocess
import zipfile
import uuid 
import shutil
import asyncio
import os
import xattr
import datetime
import logging
import inspect

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
        self.folder : Folder = folder
        self.executor = ThreadPoolExecutor(max_workers=5)
    
    async def asave_file(self , file : UploadFile , destination : Path) -> Path:
        loop = asyncio.get_event_loop()
        with open(destination , "wb") as buffer:
            file_key = str(uuid.uuid4())
            await loop.run_in_executor(self.executor , shutil.copyfileobj , file.file , buffer)
        return destination

    async def set_attr(self , file_path : str , attr_name : str , value : str):
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(self.executor , xattr.setxattr , file_path , f"user.{attr_name}" , value.encode())

    async def get_attr(self , file_path : str , attr_name : str) -> str:
        """
            Este metodo debe de recibir la ruta absoluta del archivo, para obtener su atributo extendido
        """
        def _get_attr():
            return xattr.getxattr(file_path , f"user.{attr_name}").decode()
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor , _get_attr)
    
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
    
    async def get_current_level_trash(self , path_on_folder : Optional[Path] = None) -> Dict[str , Any]:
        if path_on_folder is None:
            base_path = self.cloud_builder.current_path / '.trash/'
        else:
            base_path = self.cloud_builder.current_path / '.trash/' / path_on_folder
        tree_structure = StructureCurrentPath(current_path=base_path)
        tree_structure.current_items_on_path()
        return jsonable_encoder(tree_structure.current_items)
    
    def get_subdirs(self) -> List[str]:
        subdirs = []
        base_path = str(self.cloud_builder.current_path)
        for current_path, dirs, archivos in os.walk(base_path):
            if current_path.startswith(base_path):
                for directorio in dirs:
                    if not directorio.startswith('.'):
                        subdir_path = os.path.join(current_path, directorio)
                        subdirs.append(os.path.relpath(subdir_path, base_path))
        subdirs.append('')
        return subdirs

    def src_download(self , name_file : str) -> Path:
        base = self.cloud_builder.current_path
        down = base / Path(name_file)
        if not down.exists():
            raise Exception("Not exist this file")
        return down
            
    async def create_dir(self , name_new_dir : str , path_on_folder : Optional[str] = None):
        """
            Este metodo cumple el proposito de crear carpetas en el nivel base o anidado del folder asignado 
            al usuario siempre y cuando se pase el path interno necesario con path_folder.
        """
        key_sys = str(uuid.uuid4()) #Este será el atributo extendido de la carpeta
        if path_on_folder is None:
            structure = StructureCurrentPath(current_path=self.cloud_builder.current_path)
            await self.__run_async_command(f"mkdir -p {str(self.cloud_builder.current_path / name_new_dir)}")
            await self.set_attr(str(self.cloud_builder.current_path / name_new_dir) , "key" , key_sys)
            structure.current_items_on_path()
            newItem = structure.get_file_on_current_path(name_new_dir)
            return jsonable_encoder(newItem)
        else:
            path_new_dir = self.cloud_builder.build_path(Path(path_on_folder))
            structure = StructureCurrentPath(current_path=path_new_dir)
            await self.__run_async_command(f"mkdir -p {str(path_new_dir / name_new_dir)}")
            await self.set_attr(str(path_new_dir / name_new_dir) , "key" , key_sys) #extendemos el atributo de la carpeta
            structure.current_items_on_path()
            newItem = structure.get_file_on_current_path(name_new_dir)
            return jsonable_encoder(newItem)
    
    async def get_directory(self) -> float:
        try:
            result = await self.__run_async_command(f"du -sh {self.cloud_builder.current_path}")
            size_str = result.decode().split()[0]

            # Convierte el tamaño a gigabytes según el sufijo y redondea a 2 decimales en formato decimal
            if size_str.endswith('G'):
                return float(f"{round(float(size_str[:-1]), 2):.2f}")
            elif size_str.endswith('M'):
                return float(f"{round(float(size_str[:-1]) / 1024, 2):.2f}")
            elif size_str.endswith('K'):
                return float(f"{round(float(size_str[:-1]) / (1024 * 1024), 2):.2f}")
            elif size_str.endswith('T'):
                return float(f"{round(float(size_str[:-1]) * 1024, 2):.2f}")
            else:
                raise ValueError(f"Tamaño desconocido: {size_str}")

        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    async def get_plan_size(self) -> float:
        try:
            limt = self.folder.limit_capacity

            if limt == 500:
                limt = 0.5
            elif limt == 1:
                limt = 1.0
            elif limt == 10:
                limt = 10.0

            return limt
        
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
    
    async def mv_resource(self, path_on_folder: Path, destiny_resource_path: Path):
        if not path_on_folder or not destiny_resource_path:
            raise HTTPException(status_code=400, detail="Falta información para mover el recurso")

        root_path = self.cloud_builder.current_path
        current_resource_path = root_path / path_on_folder
        destiny_resource_path = root_path / destiny_resource_path

        if not current_resource_path.exists():
            raise HTTPException(status_code=404, detail=f"El recurso {current_resource_path} no existe")
        
        if current_resource_path == destiny_resource_path:
            raise HTTPException(status_code=400, detail="La ruta de destino es la misma que la de origen")

        if not str(current_resource_path).startswith(str(root_path)) or not str(destiny_resource_path).startswith(str(root_path)):
            raise HTTPException(status_code=400, detail="No se puede mover el recurso fuera del directorio raíz")

        if destiny_resource_path.exists() and destiny_resource_path.is_dir():
            destiny_resource_path = destiny_resource_path / current_resource_path.name
        
        try:
            # Ejecutar el comando de mover el recurso
            await self.__run_async_command(f"mv {str(current_resource_path)} {str(destiny_resource_path)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al mover el recurso: {str(e)}")

    async def upload_files(self , files : List[UploadFile] , path_on_folder : Optional[Path] = None) -> Dict[str , Any]:
        copy_tasks = []
        ext_attr = []
        if path_on_folder is None:
            base_path = self.cloud_builder.current_path
        else:
            base_path = self.cloud_builder.build_path(path_on_folder)
        
        for file in files:
            destination_path = base_path / file.filename
            copy_tasks.append(self.asave_file(file , destination_path))
        
        files_sys = await asyncio.gather(*copy_tasks) #Ejecutamos concurrentement la creación de los archivos
        
        for path_new_files in files_sys:
            file_key = str(uuid.uuid4())
            ext_attr.append(self.set_attr(str(path_new_files) , "key" , file_key))
        
        await asyncio.gather(*ext_attr) #Ejecutamos concurrentemente la extensión de atributos para los nuevos archivos
        
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

        
    async def delete_or_mv_folder(self , path_folder : Optional[Path] = None) -> Dict[str , bool]:
        if path_folder is None:
            raise Exception("Set a folder")
        base_path = self.cloud_builder.build_path(path_folder)
        if not base_path.is_dir():
            raise Exception("This path pointer not folder")
        try:
            #----------- Logica de eliminado de carpetas vacias del sistema. ------------------
            structure = StructureCurrentPath(current_path=base_path)
            structure.current_items_on_path()
            if len(structure.current_items) != 0:
                await self.__run_async_command(f"mv {base_path} {self.cloud_builder.current_path}/.trash/")
                return {"deleted" : False , "moved" : True}
            else:
                shutil.rmtree(str(base_path))
                return {"deleted" : True , "moved" : False}
            #----------------------------------------------------------------------------------
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="El directorio ya ha sido eliminado o no existe")

        except PermissionError:
            raise HTTPException(status_code=403 , detail="No posees permisos")
    
    def __generate_uuid_symlink(self) -> uuid.UUID:
        return uuid.uuid4()
    
    def __generate_symlink(self , user_to : User , symlink_id : str) -> bool:
        temp_symlinks_dir = self.cloud_builder.build_path(".symlinks/") #Referencia  a la carpeta de enlaces simbolicos
        symlink_dir = temp_symlinks_dir / symlink_id # uuid_user/.symlinks/uuid_symlink enlace simbolico para que el usuario transfiera recursos
        builder_share = (
            BuilderTransferPath(root=_env_values.ROOT_TRANSFER_PATH)
            .build_folder_path(user_to.folder)
        ) #Direccion donde se encuentra el archivo de transferidos para el usuario que se enviarán archivos
        try:
            os.symlink(builder_share.current_path , symlink_dir)
            return True
        except OSError:
            print("Hubo un erro al crear espacios de transferencia.")
            return False

    
    async def __get_info_resource(self , name_resource : str , path_folder : Optional[Path] = None ) -> Optional[Dict[str , Any]]:
        if path_folder is None:
            base_path = self.cloud_builder.current_path #Desdela raiz
        else:
            base_path = self.cloud_builder.build_path(path_folder)
            
        if not base_path.is_dir():
            raise Exception("La ruta interna no es una carpeta")
        
        path_to_resource = base_path / name_resource
        
        if path_to_resource.is_dir() or path_to_resource.is_file():
            id = await self.get_attr(str(path_to_resource) , "key")
            info_resource = {
                "id" : id,
                "name" : path_to_resource.name, 
                "space" : path_to_resource.stat().st_size
            }
        if path_to_resource.is_dir():
            info_resource["type"] = "folder"
        else:
            info_resource["type"] = "file"
        return info_resource
    
    async def config_pending_share(
            self , name_resource : str , 
            path_folder : Optional[Path] ,
            user_by : User ,  
            user_to : User
        ) -> PendingShared:
        info_resource = await self.__get_info_resource(name_resource , path_folder)
        symlink_share = self.__generate_uuid_symlink() #Configuración del enlace simbolico
        
        return PendingShared(
            emisor=user_by , 
            receptor=user_to,
            name=info_resource["name"],
            type = info_resource["type"],
            key_resource=info_resource["id"],
            space=info_resource["space"],
            linksimb=symlink_share,
            state=StateShare.PENDING,
            exp=datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=2) #Tiempo de expiración del enlace simbolico para hacer valida la transferencia de datos
        )
    async def transfer_resource(self , pending_request : PendingShared) -> None:
        #Busqueda del recurso y producción de la ruta del enlace simbolico.
        generated_linksim = self.__generate_symlink(user_to=pending_request.receptor , symlink_id=str(pending_request.linksimb)) #Creamos un enlace simbolico temporal
        resource_path = await self.__get_resource_by_attr(pending_request.key_resource)
        symlinks_base = self.cloud_builder.build_path(Path(".symlinks"))
        symlink_path_destination = symlinks_base / f"{str(pending_request.linksimb)}"

        #Transferir el recurso si es carpeta se comprime en zip y si no se copia a la ruta que apunta el enlace simbolico
        if resource_path.is_dir():
            logger.info(f"Nombre de la carpeta: {resource_path.name}")
            zip_name = resource_path.name + ".zip"
            zip_path_destino = symlink_path_destination / Path(f"{zip_name}") #Para que se cree dentro de la carpeta de transferidos del usuario receptor
            with zipfile.ZipFile(zip_path_destino , "w") as zipf:
                for file in resource_path.rglob("*"):
                    zipf.write(file , arcname=file.relative_to(resource_path))
        else:
            symlink_path_destination_file = symlink_path_destination / f"{str(resource_path.name)}"
            shutil.copyfile(resource_path , symlink_path_destination_file)
        #Eliminar el enlace simbólico
        symlink_path_destination.unlink() #Se elimina el enlace simbolico temporal para la transferencia de recursos


    async def __get_resource_by_attr(self , attr_value : uuid.UUID , attr_name : str = "key") -> Optional[Path]:
        """
        Esta función es la encargada de por ID encontrar en la raiz del usuario un archivo especifico,que tenga el valor `attr_value`
        en el `attr_name` establecido previamente, esto devuelve el path completo del archivo.
        """
        # ROOT : CARPETA , FILES : ARCHIVOS EN ROOT
        match_resource : Optional[str] = None
        for root , _ , files in os.walk(self.cloud_builder.current_path): #Iterando sobre la estructura de directorios de la raiz del usuario
            try:
                attr_root = await self.get_attr(root, attr_name)
                if attr_root == str(attr_value):
                    match_resource = Path(root)
                    break  # Salimos del bucle si encontramos el recurso
            except OSError:
                ...
            for file in files:
                filepath = os.path.join(root , file) #concatenamos la carpeta al nombre del archivo para obtener el path completo.
                try:
                    attr_file = await self.get_attr(filepath , attr_name)
                    logger.info(f"PATH -> [{filepath}] : UUID -> [{attr_file}]")
                    if attr_file == str(attr_value):
                        match_resource = Path(filepath)
                except OSError:
                    ...
        return match_resource
            

class SysManagementShareResources(SysManagement):
    allowed_methods = [
        "get_current_level",
        "set_attr",
        "get_attr",
        "__run_async_command",
        "transfer_builder",
        "src_download"
    ]
    def __init__(self, root: str, folder: Folder) -> None:
        self.transfer_builder = ( #Contrucción del Path base del usuario en /cloud_transfer/
            BuilderTransferPath(root)
            .build_folder_path(folder)
            )
    def __getattribute__(self, name: str) -> Any:
        allowed_methods = object.__getattribute__(self , "allowed_methods")
        if name not in allowed_methods:
            raise AttributeError(f"'{self.__class__.__name__}' object has no attribute '{name}'")
        return super().__getattribute__(name)
    
    def get_current_level(self) -> Dict[str, Any]:
        tree_structure = StructureCurrentPath(current_path=self.transfer_builder.current_path)
        tree_structure.current_items_on_path()
        return jsonable_encoder(tree_structure.current_items)

    def src_download(self , name_file : str) -> Path:
        base = self.transfer_builder.current_path
        down = base / Path(name_file)
        if not down.exists():
            raise Exception("Not exist this file")
        return down
        
        
