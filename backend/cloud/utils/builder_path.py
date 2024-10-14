from abc import ABCMeta, abstractmethod
from pathlib import Path
from typing import Any , Dict, List, Self
from models.documents import Folder
from models.models import StructureCurrentPath, ItemFileSystem
from fastapi.exceptions import HTTPException
class BuilderPath(metaclass=ABCMeta):
    """
        ##### Documentación util
        - `Suma de Paths`: 
            ```python
                from pathlib import Path
                # Crear dos objetos Path
                base_path = Path("/home/user")
                sub_path = Path("documents/report.txt")

                # Sumar las rutas
                full_path = base_path / sub_path

                print(full_path)  # /home/user/documents/report.txt
            ```
        - `Obtener el padre`:
            ```python
                from pathlib import Path
                # Crear una ruta
                ruta = Path("/home/user/documents/report.txt")

                # Subir al directorio padre
                ruta_padre = ruta.parent

                print(ruta_padre)  # /home/user/documents
            ``` 
    """
    @abstractmethod
    def build_folder_path(self , folder : Folder) -> Path:
        """
            #### Construye la raiz en la cual operara el usuario con respecto a su UUID
            ```text
                |_ raiz
                    |_ u3445g4hfkdlk
            ```
        """
        ...
    @abstractmethod
    def build_path(self , inner_path : Path) -> Path:
        """
            Construye el path interno dentro de la carpeta asignada al usuario
            ```text
                |_ raiz
                    |_ u3445g4hfkdlk
                        |_ sql
            ```
        """
        ...

class BuilderCloudPath(BuilderPath):
    def __init__(self , root : str) -> None:
        """
            - `root` : debe ser un str del tipo '/cloud_root'
        """
        self.root = Path(root)
        self.current_path = None
        self.current_structure = StructureCurrentPath()

    def build_folder_path(self, folder: Folder) -> Self:
        """
            #### Ejemplo de uso
            Supongamos que el usuario `diegitfk` tiene asociado el folder `u478fghjk4lm`
            ```python 
                user = await User.find_one(User.username == "diegitfk" , fetch_links= True)
                builder_cloud_path = BuilderCloudPath("/root")
                builder_cloud_path.build_folder_path(folder = user.folder) #/root/u478fghjk4lm 
            ```

        """
        folder_dir = Path(str(folder.folder_name))
        self.current_path = self.root / folder_dir
        return self
    
    def build_path(self, inner_path: Path) -> Path:
        """
            #### Ejemplo de uso
            ```python
                user = await User.find_one(User.username == "diegitfk" , fetch_links= True)
                builder_cloud_path = BuilderCloudPath("/root")
                builder_cloud_path.build_folder_path(folder = user.folder) #/root/u478fghjk4lm 
                builder_cloud_path.build_path(inner_path=Path(estudio)) # /root/u478fghjk4lm/estudio
            ```
        """
        test_path = self.current_path / inner_path
        
        if not str(test_path.resolve()).startswith(str(self.current_path.resolve())):
            raise HTTPException(status_code=403, detail="Attempt to access restricted area.")
        
        if not test_path.exists():
            raise HTTPException(status_code=404 , detail=f"Path {inner_path} not found")
        return self.current_path / inner_path
    
    def get_current_level(self) -> List[ItemFileSystem]:
        if self.current_path.is_file():
            self.current_structure.current_path = self.current_path.parent
            items_on_level = self.current_structure.current_items_on_path()
            return items_on_level
        else:
            items_on_level = self.current_structure.current_items_on_path()
            return items_on_level

