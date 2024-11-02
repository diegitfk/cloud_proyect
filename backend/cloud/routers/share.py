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
        try:
            if username not in self.__active_connections.keys():
                print("El usuario no posee sesiones activas")
            for connection in self.__active_connections[username]:
                await connection.send_text(message)
        except KeyError:
            ...

share_router = APIRouter(prefix="/share")
manager_sockets = ConnectionManagerSockets()
auth_schema = JwtFlow()
#Ruta para crear activar una conexión de un cliente en los websockets
@share_router.websocket("/ws/notifications/") #Email del usuario que iniciara un sesión con el websocket
async def sub_to_connection(websocket : WebSocket , token : TokenData = Depends(auth_schema)):
    """
        Estructura de los eventos entre sockets
        ### Transferencia de recursos
        {
            "event" : $TYPE_EVENT ["transfer_resource" , "accept_resource" , "reject_resource"],
            "from" : $USERNAME_SOCKET_SENDING_CONNECTION,
            "to" : $USERNAME_SOCKET_RECEIVED_CONNECTION
        }
        Si el evento es accept_resource se agrega la llave id_pending que es el id de la solicitud que se acepto.
    """
    await manager_sockets.connect(websocket , token.username)
    try:
        while True:
            received_event = await websocket.receive_text()
            json_sending = json.loads(received_event)
            #Si el evento es una solicitud para transferir recursos
            if json_sending["event"] == "Transferencia de Recursos":
                logger.info(f"{json_sending["from"]} quiere transferir recursos a {json_sending["to"]}")
                await manager_sockets.send_notification_user(json.dumps(json_sending) , user_email=json_sending["to"])
            #Si el evento es una solicitud para aceptar la transferencia de recursos
            if json_sending["event"] == "Transferencia Aceptada":
                logger.info(f"acepto la transferencia {json_sending["from"]}")
                logger.info(f"a : {json_sending["to"]}")
                await manager_sockets.send_notification_user(json.dumps(json_sending) , user_email=json_sending["to"])
            #Si el evento es una solicitud para eliminar la transferencia de recursos.
            if json_sending["event"] == "Transferencia Rechazada":
                logger.info(f"a rechazado la transferencia {json_sending["from"]}")
                logger.info(f"A : {json_sending["to"]}")
                await manager_sockets.send_notification_user(json.dumps(json_sending) , json_sending["to"])

    except WebSocketDisconnect:
        manager_sockets.disconnect(websocket , token.username)
        
    
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
    #Se envia un mensaje de que se hizo una solicitud de transferencia de recursos
    await manager_sockets.send_notification_user(message=json.dumps({
        "event" : "Transferencia de Recursos" , 
        "from" : token.username , 
        "to" : user_to.username}) , 
        username=user_to.username)
    
    return JSONResponse(content={"State" : "Accepted Request"} , status_code=200)

@share_router.put("/accept_share/{id_pending}")
async def accept_file_req(
        id_pending : Annotated[str , Path()],
        token : Annotated[TokenData , Depends(auth_schema)],
        session_db = Depends(start_session_db)
    ):
    """
        Controller encargado de cambiar el estado de la solicitud pendiente a "ACEPTADO"
        además se transfiere una copia mediante un enlace simbolico a la carpeta del usuario
        respectivo en cloud_transfer y se agrega en el nivel inicial.
    """
    logging.info(f"{id_pending}")
    pending_share = await PendingShared.get(document_id=id_pending , fetch_links=True)
    logging.info(f"{pending_share}")
    if pending_share is None:
        raise HTTPException(
            status_code=404,
            detail={"Not exist" : "The request not exist"}
        )
    pending_share.state = StateShare.ACCEPTED #Cambio en el estado de la solicitud
    await pending_share.save()
    await manager_sockets.send_notification_user(json.dumps(
        {"event" : "Transferencia Aceptada" , 
         "from" : token.username , 
         "to" : pending_share.emisor.username,
         "id_pending" : str(pending_share.id) 
         }) , pending_share.emisor.username)
    
    return JSONResponse(content={"Accepted" : "Transfer Executing"})

@share_router.put("/reject_share/{id_pending}")
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
    pending_share = await PendingShared.get(document_id=id_pending , fetch_links=True)
    if pending_share is None:
        raise HTTPException(
            status_code=404,
            detail={"Not exist" : "The request not exist"}
        )
    pending_share.state = StateShare.REJECTED #Cambio en el estado de la solicitud
    await pending_share.save()
    #Se transfieren el recurso asociado a la solicitud de intercambio de recursos.
    await manager_sockets.send_notification_user(json.dumps(
        {"event" : "Transferencia Rechazada" , 
         "from" : token.username , 
         "to" : pending_share.emisor.username
         }) , pending_share.emisor.username)
    
    return JSONResponse(content={"Accepted" : "Transfer Rejected"})

@share_router.put("/share_resource/{id_pending}")
async def share_resource_controller(
        id_pending : Annotated[str , Path()],
        token : Annotated[TokenData , Depends(auth_schema)],
        session_db = Depends(start_session_db)
    ):
    user = await User.find_one(User.username == token.username , fetch_links=True)
    pending_share = await PendingShared.get(id_pending , fetch_links=True)
    if pending_share.state != StateShare.ACCEPTED:
        raise HTTPException(
            status_code=400 , 
            detail={
                "Error Transaction" : f"The request isn´t accepted by {pending_share.receptor.username}"
                }
            )
    sys_manager = SysManagement(root=_env_values.ROOT_CLOUD_PATH , folder=user.folder)
    await sys_manager.transfer_resource(pending_share)
    return JSONResponse(
        {
        "resource" : f"{pending_share.name}" , 
        "to" : f"{pending_share.receptor.username}"
        }
    )
