from typing import Optional
from models.documents import User , Folder
from utils.security import _env_values
import asyncio
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
        if dir_inside_folder is None:
            self.base_path = "/".join([_env_values.ROOT_CLOUD_PATH , str(folder.folder_name)])
        else:
            path_dirs = dir_inside_folder.strip("/").split("/")
            path_dirs.insert(0 , str(folder.folder_name))
            path_dirs.insert(0 , _env_values.ROOT_CLOUD_PATH)
            self.base_path = "/".join(path_dirs)

    async def __run_async_command(self , comand : str) -> bytes:
        process = await asyncio.create_subprocess_shell(
            cmd=comand,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        output , error = await process.communicate()
        if error:
            raise ComandError("Error in executing command")
        return output
        
    async def create_dir(self , folder : Folder ,name_dir : str , path_folder : Optional[str] = None) -> None:
        if not path_folder:
            self.construct_base_path(folder) #ya podemos trabajar con el path base del usuario
            print(self.base_path)
        else:
            self.construct_base_path(folder , path_folder) #ya podemos trabajar con el path base del usuario
            print(self.base_path)

        path_new_dir = self.base_path + "/" + name_dir
        if self.base_path is None:
            raise NotConstructBasePath("you are not call the construct_base_path method")
        await self.__run_async_command(f"mkdir {path_new_dir}")
        
        