from fastapi import APIRouter, Path , Query , Depends , WebSocket , WebSocketDisconnect
from fastapi.exceptions import HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from typing import Optional , List , Dict , Annotated
from models.documents import PendingShared , User , Folder , PendingShareView
from models.models import ShareResourceRequest , StateShare
from utils.sys_management import SysManagement
from utils.security import JwtFlow , _env_values , TokenData
from routers.webhooks import start_session_db
from pathlib import Path
import logging
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConnectionManagerSockets:
    def __init__(self):
        #Diccionario en memoria que administrará todos los sockets activos de un usuario
        self.__active_connections : Dict[str, List[WebSocket]] = dict()
    
    async def connect(self , websocket : WebSocket , username : str):
        await websocket.accept()
        if username not in self.__active_connections.keys(): #Si no existe el usuario registrado se registra el correo y se agrega el primer socket
            self.__active_connections[username] = []
            self.__active_connections[username].append(websocket)
        else: #Si existe el usuario se pusea una conexión más de este a la memoria
            self.__active_connections[username].append(websocket)
        logger.info(f"{self.__active_connections}")
    
    def disconnect(self , websocket : WebSocket , username : str):
        if not self.__active_connections[username]:
            self.__active_connections.pop(username)
        self.__active_connections[username].remove(websocket) #Elimina el websocket de las conexiones activas
        logger.info(f"{self.__active_connections}")
        
    async def send_notification_user(self , message : str , username : str):
        if username not in self.__active_connections.keys():
            print("El usuario no posee sesiones activas")
        for connection in self.__active_connections[username]:
            await connection.send_text(message)

share_router = APIRouter(prefix="/share")
manager_sockets = ConnectionManagerSockets()
auth_schema = JwtFlow()
#Ruta para crear activar una conexión de un cliente en los websockets
@share_router.websocket("/ws/notifications/{username}") #Email del usuario que iniciara un sesión con el websocket
async def sub_to_connection(websocket : WebSocket , username: str):
    """
        Estructura de los eventos entre sockets
        ### Transferencia de recursos
        {
            "event" : $TYPE_EVENT ["transfer_resource" , "accept_resource" , "reject_resource"],
            "from" : $USERNAME_SOCKET_SENDING_CONNECTION,
            "to" : $USERNAME_SOCKET_RECEIVED_CONNECTION
        }
    """
    await manager_sockets.connect(websocket , username)
    try:
        while True:
            received_event = await websocket.receive_text()
            json_sending = json.loads(received_event)
            #Si el evento es una solicitud para transferir recursos
            if json_sending["event"] == "transfer_resource":
                logger.info(f"{json_sending["from"]} quiere transferir recursos a {json_sending["to"]}")
                await manager_sockets.send_notification_user(json.dumps(json_sending) , user_email=json_sending["to"])
            #Si el evento es una solicitud para aceptar la transferencia de recursos
            if json_sending["event"] == "accept_resource":
                logger.info(f"acepto la transferencia {json_sending["from"]}")
                logger.info(f"a : {json_sending["to"]}")
                await manager_sockets.send_notification_user(json.dumps(json_sending) , user_email=json_sending["to"])
            #Si el evento es una solicitud para eliminar la transferencia de recursos.
            if json_sending["event"] == "reject_resource":
                logger.info(f"a rechazado la transferencia {json_sending["from"]}")
                logger.info(f"A : {json_sending["to"]}")
                await manager_sockets.send_notification_user(json.dumps(json_sending) , json_sending["to"])

    except WebSocketDisconnect:
        manager_sockets.disconnect(websocket , username)
        
    
@share_router.get("/pending_share")
async def get_all_pending_shareds(
    token : TokenData = Depends(auth_schema),
    session_db = Depends(start_session_db)
    ):
    """
        Función encargada de mostrar todas las solicitudes para compartir archivos pendientes 
        para el usuario.
    """
    user = await User.find_one(User.username == token.username)
    pending_shareds = await PendingShared.find(
            PendingShared.state == StateShare.PENDING,
            PendingShared.receptor.id == user.id, 
            fetch_links=True,
            projection_model=PendingShareView
        ).to_list()
    logger.info(f"{pending_shareds}")
    return JSONResponse(
            content={
                "shared_pending" : jsonable_encoder(pending_shareds)
            }
        )

@share_router.post("/transfer_resource")
async def transfer_resource_req(
    request_share_resource : ShareResourceRequest,
    token : TokenData = Depends(auth_schema),
    session_db = Depends(start_session_db)
    ):
    """
        Controller encargado de recibir un archivo o una carpeta del usuario y procesarla 
        para crear una solicitud pendiente.,
    """
    user_by = await User.find_one(User.username == token.username , fetch_links=True)
    user_to = await User.find_one(User.username == request_share_resource.to , fetch_links=True)
    if user_to is None:
        raise HTTPException(
            status_code=404 , 
            detail={
                "Not valid username" : "Isn´t valid username for send files"
            }
        ) #Si el nombre de usuario al que se envia no existe en sistema.
    logger.info(f"transferencia de recurso desde : {user_by.username} para {user_to.username}")
    manager = SysManagement(root=_env_values.ROOT_CLOUD_PATH , folder=user_by.folder)
    pending_share = await manager.config_pending_share(request_share_resource.name , request_share_resource.path , user_by , user_to)
    logger.info(f"Solicitud Pendiente Registrada")
    await pending_share.save()
    return JSONResponse(content={"State" : "Accepted Request"} , status_code=200)

@share_router.post("/accept_share/{id_pending}")
async def accept_file_req():
    """
        Controller encargado de cambiar el estado de la solicitud pendiente a "ACEPTADO"
        además se transfiere una copia mediante un enlace simbolico a la carpeta del usuario
        respectivo en cloud_transfer y se agrega en el nivel inicial.
    """
    await manager_sockets.send_notification_user(json.dumps({"event" : "accept_resource" , "from" : "tomasxd" , "to" : "diegoxd"}) , "diegoxd")
    ...
@share_router.post("/reject_share/{id_pending}")
async def reject_file_req(
        id_pending : str ,
        token : TokenData = Depends(auth_schema),
        session_db = Depends(start_session_db) 
    ):
    """
        Controller encargado de cambiar el estado de la solicitud pendiente a "RECHAZADO"
        este controller no afecta a cloud_transfer, solamente se encarga de cambiar el estado de la 
        solicitud y delegar la notificación de rechazo
        Proceso de rechazo
        Obtener el pending de la colección transfers
        Obtener el enlace simbólico del pending
        Eliminar el enlace 
    """
    
