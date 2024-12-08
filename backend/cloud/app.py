from fastapi import FastAPI, Form, UploadFile, Path, Query , Body,  Request , status , Response , Depends, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path as PathSys
from routers.webhooks import webhook_router, start_session_db
from routers.share import share_router
from dotenv import dotenv_values
from utils.sys_management import SysManagement, _env_values
from models.documents import User , Folder
from models.models import CreateDir , PathOperation
from jwt import DecodeError , ExpiredSignatureError
from utils.security import JwtFlow , TokenData
from typing import Annotated, Optional
import shutil
import os
"""
    ### Finalidad de este archivo
    Contiene todos los controladores y puntos finales de la api, para el login, 
    este modulo es el cuerpo principal del servicio /account
"""
auth_schema = JwtFlow()
app = FastAPI(root_path="/cloud")
app.include_router(webhook_router)
app.include_router(share_router)
#Errores de validacion del token que finalizaran la sesion de la cookie
@app.exception_handler(DecodeError)
async def invalid_token_finish_session(req : Request , exc : DecodeError):
    response = Response(content="This token is invalid" , status_code=status.HTTP_401_UNAUTHORIZED)
    response.delete_cookie("session_jwt")
    return response

@app.exception_handler(ExpiredSignatureError)
async def expire_token_finish_session(req : Request , exc : ExpiredSignatureError):
    response = Response(content="Expire token" , status_code=status.HTTP_401_UNAUTHORIZED)
    response.delete_cookie("session_jwt")
    return response

@app.get("/file")
async def get_file(
    token : Annotated[TokenData , Depends(auth_schema)] , 
    path : Annotated[PathSys , Query(...)] , 
    session_db = Depends(start_session_db)
    ):
    user = await User.find_one( User.username == token.username, fetch_links=True)
    sys_manager = SysManagement(root=_env_values.ROOT_CLOUD_PATH , folder=user.folder)
    file_path = sys_manager.cloud_builder.build_path(path)
    return FileResponse(
        path=file_path , 
        headers={"Content-Disposition" : f"attachment; filename={file_path.name}"},
        media_type="application/octet-stream" , 
        filename=file_path.name
        )

@app.get("/subdirs")
async def get_subdirs(
    token : Annotated[TokenData , Depends(auth_schema)],
    session_db = Depends(start_session_db)
    ):
    user = await User.find_one(User.username == token.username , fetch_links=True)
    sys_manager = SysManagement(root=_env_values.ROOT_CLOUD_PATH , folder=user.folder)
    return sys_manager.get_subdirs()

@app.post("/tree")
async def get_current_level_items(
    token : Annotated[TokenData , Depends(auth_schema)] , 
    path : PathOperation , 
    session_db = Depends(start_session_db)
    ):
    user = await User.find_one( User.username == token.username, fetch_links=True)
    sys_manager = SysManagement(root=_env_values.ROOT_CLOUD_PATH , folder=user.folder)
    return await sys_manager.get_current_level(path.path_on_folder)

@app.post("/trash")
async def get_current_level_trash(
    token : Annotated[TokenData , Depends(auth_schema)],
    path : PathOperation,
    session_db = Depends(start_session_db)
):
    user = await User.find_one( User.username == token.username, fetch_links=True)
    sys_manager = SysManagement(root=_env_values.ROOT_CLOUD_PATH , folder=user.folder)
    return await sys_manager.get_current_level_trash(path.path_on_folder)

@app.post("/rename_dir/{new_name_dir}")
async def rename_dir(
        new_name_dir : Annotated[str , Path(...)] , 
        token : Annotated[TokenData , Depends(auth_schema)] , 
        path : Annotated[Optional[str] , Query(...)], 
        session_db = Depends(start_session_db)
    ) -> None:

    user = await User.find_one( User.username == token.username, fetch_links=True)
    sys_manager = SysManagement()
    await sys_manager.rename_file_or_folder(folder=user.folder , new_name=new_name_dir , path_folder=path)

# AQUI IRA LA OPCION DE LEER EL DIRECTORIO
@app.get("/get_diroot_size")
async def get_dir(
    token : Annotated[TokenData , Depends(auth_schema)] , 
    session_db = Depends(start_session_db)
) -> float:
    user = await User.find_one(User.username == token.username, fetch_links=True)
    sys_manager = SysManagement(root=_env_values.ROOT_CLOUD_PATH , folder=user.folder)
    size_dir = await sys_manager.get_directory()
    return size_dir

@app.get("/get_plan_size")
async def get_dir(
    token : Annotated[TokenData , Depends(auth_schema)] , 
    session_db = Depends(start_session_db)
) -> float:
    user = await User.find_one(User.username == token.username, fetch_links=True)
    sys_manager = SysManagement(root=_env_values.ROOT_CLOUD_PATH , folder=user.folder)
    size_plan = await sys_manager.get_plan_size()
    return size_plan


@app.post("/dir")
async def creating_a_dir(
        createdir : CreateDir,
        token : Annotated[TokenData , Depends(auth_schema)] , 
        session_db = Depends(start_session_db)
    ) -> None:
    
    user = await User.find_one( User.username == token.username, fetch_links=True)
    sys_manager = SysManagement(root=_env_values.ROOT_CLOUD_PATH , folder=user.folder)
    new_dir = await sys_manager.create_dir(name_new_dir=createdir.name_dir , path_on_folder=createdir.path_on_folder)
    return JSONResponse(content={"new_dir" :new_dir })

@app.post("/upload_files")
async def recept_files(
    token : Annotated[TokenData , Depends(auth_schema)] , 
    files : list[UploadFile], 
    path : Annotated[Optional[PathSys] , Form(...)] = None , 
    session_db = Depends(start_session_db)
    ):
    
    user = await User.find_one(User.username == token.username , fetch_links=True)
    sys_manager = SysManagement(root=_env_values.ROOT_CLOUD_PATH , folder=user.folder)
    uploadfiles = await sys_manager.upload_files(files , path)
    return uploadfiles

@app.post("/mv_resource")
async def move_resource(
    token : Annotated[TokenData , Depends(auth_schema)] , 
    path_resource : Annotated[PathSys , Body(...)], 
    path_move_to : Annotated[PathSys , Body(...)],
    session_db = Depends(start_session_db)
    ):
    user = await User.find_one(User.username == token.username , fetch_links=True)
    sys_manager = SysManagement(root=_env_values.ROOT_CLOUD_PATH , folder=user.folder)
    await sys_manager.mv_resource(path_resource , path_move_to)
    return JSONResponse(content={"info" : "Recurso Movido Exitosamente" , "from" : str(path_resource) , "to" : str(path_move_to)})

@app.delete("/folder")
async def delete_folder_tree(
    token : Annotated[TokenData , Depends(auth_schema)], 
    path : PathOperation , 
    session_db = Depends(start_session_db)
    ):
    user = await User.find_one(User.username == token.username , fetch_links=True) 
    sys_manager = SysManagement(root=_env_values.ROOT_CLOUD_PATH , folder=user.folder)
    delete_folder_info = await sys_manager.delete_or_mv_folder(path_folder=path.path_on_folder)
    return JSONResponse(content=delete_folder_info)

@app.delete("/file/{filename}")
async def delete_file_tree(
    token : Annotated[TokenData , Depends(auth_schema)],
    filename : Annotated[str , Path(...)],
    path : PathOperation,
    session_db = Depends(start_session_db)
    ):
    user = await User.find_one(User.username == token.username , fetch_links=True)
    sys_manager = SysManagement(root=_env_values.ROOT_CLOUD_PATH , folder=user.folder)
    operation = sys_manager.delete_file(filename=filename , path_folder=path.path_on_folder)
    return {"Response" : operation.model_dump()}

@app.get("/download_file/")
async def download_file(
    name: Annotated[str, Query(...)],
    token: Annotated[TokenData, Depends(auth_schema)], 
    session_db = Depends(start_session_db)
):
    # Limpia el nombre eliminando cualquier '/' inicial o codificado
    clean_name = name.lstrip('/').lstrip('%2F')
    
    user = await User.find_one(User.username == token.username, fetch_links=True)
    sys_manager = SysManagement(root=_env_values.ROOT_CLOUD_PATH, folder=user.folder)
    file_download = sys_manager.src_download(clean_name)
    
    return FileResponse(
        path=file_download,
        headers={"Content-Disposition": f"attachment; filename={file_download.name}"},
        media_type="application/octet-stream", 
        filename=file_download.name
    )

@app.get("/download_folder/")
async def download_folder(
    name: Annotated[str, Query(...)],
    token: Annotated[TokenData, Depends(auth_schema)], 
    session_db = Depends(start_session_db)
):
    # Limpia el nombre eliminando cualquier '/' inicial o codificado
    clean_name = name.lstrip('/').lstrip('%2F')
    
    user = await User.find_one(User.username == token.username, fetch_links=True)
    sys_manager = SysManagement(root=_env_values.ROOT_CLOUD_PATH, folder=user.folder)
    
    # Obtener la ruta completa del directorio
    folder_path = sys_manager.src_download(clean_name)
    
    # Verificar si es un directorio
    if not os.path.isdir(folder_path):
        raise HTTPException(status_code=400, detail="The specified path is not a directory")
    
    # Crear un nombre de archivo ZIP
    zip_filename = f"{os.path.basename(folder_path)}.zip"
    zip_path = os.path.join(os.path.dirname(folder_path), zip_filename)
    
    try:
        # Crear el archivo ZIP
        shutil.make_archive(
            os.path.splitext(zip_path)[0],  # Quitar la extensión .zip
            'zip',
            folder_path
        )
        
        # Devolver el archivo ZIP
        return FileResponse(
            path=zip_path,
            headers={
                "Content-Disposition": f"attachment; filename={zip_filename}",
                "Content-Type": "application/zip"
            },
            media_type="application/zip",
            filename=zip_filename
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating ZIP file: {str(e)}")
    finally:
        # Opcional: limpiar el archivo ZIP después de la descarga
        # Dependiendo de tus requisitos, podrías querer mantener o eliminar el archivo ZIP
        if os.path.exists(zip_path):
            os.remove(zip_path)