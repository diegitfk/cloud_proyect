from fastapi import FastAPI , Depends, status, Form, Request
from fastapi.responses import JSONResponse , Response
from fastapi.exceptions import HTTPException
from models.db import engine
from beanie import init_beanie
from beanie.operators import Or
from models.models import UserSign, UserLogin, NewAccount, CredentialsTransaction
from jwt import DecodeError , ExpiredSignatureError
from utils.security import SecurityFlow , JwtFlow, TokenData, Token , _env_values
from models.documents import User , Plan
from typing import Annotated, Any
from pydantic import EmailStr
from datetime import timedelta
import httpx


app = FastAPI(root_path="/auth")
context_crypt = SecurityFlow("sha256_crypt")
authorization_schema = JwtFlow()
async def start_db():
    db_session = init_beanie(engine["auth_db"] , document_models=[User , Plan])
    try:
        yield await db_session
    finally:
        db_session.close()
        
#Webhook de comunicación con servicio de cloud
@app.webhooks.post("new-account")
async def send_register_event_to_cloud(event_new_account : NewAccount):
    async with httpx.AsyncClient() as client:
        response_generate_api_key = await client.get(url=_env_values.WEBHOOK_START_TRANSACTION)
        if response_generate_api_key.status_code != 200: #En caso de que cloud_server no responda correctamente al obtener credenciales de transaccion.
            raise HTTPException(status_code=status.HTTP_409_CONFLICT , detail={"reason" : "No created credentials"})
        credentials_response = response_generate_api_key.json()
        credentials = CredentialsTransaction(**credentials_response)
        transaction_new_event = await client.post(
            url=_env_values.WEBHOOK_NEW_ACCOUNT_URL , 
            json=event_new_account.model_dump(exclude_none=True),
            headers={
                "X-Signature" : credentials.api_key,
                "X-Transaction" : credentials.id_transaction
            })
        if transaction_new_event.status_code != 201: #En caso de que cloud_server no responda correctamente al configurar las carpetas en el sistema
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail={"reason" : "Error on configuration dir"})
        transaction_response_json : dict[str , Any] = transaction_new_event.json()
    return transaction_response_json

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

#Endpoint de Sign al sistema.
@app.post("/sign")
async def sign_on_sys(register_user_data : UserSign , start_session_db = Depends(start_db)):
    #obtener un posible usuario con el email registrado
    user_on_db_by_email_or_username = await User.find(Or(User.email == register_user_data.email , User.username == register_user_data.username)).first_or_none()
    if user_on_db_by_email_or_username:
        raise HTTPException({"reason" : "actually this email or username is register on system try with other username or email"} , status_code=status.HTTP_400_BAD_REQUEST)
    hash_password = context_crypt.crypt_password(register_user_data.password)
    plan_selected = await Plan.find_one(Plan.type == register_user_data.plan)
    if not plan_selected:
        raise HTTPException(detail={"reason" : "The plan selected is not valid"} , status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
    new_user = User(
        username=register_user_data.username,
        nombre=register_user_data.nombre,
        apellido=register_user_data.apellido,
        email=register_user_data.email,
        password=hash_password,
        plan=plan_selected.id
    )
    res = await send_register_event_to_cloud(
        NewAccount(
            username=new_user.username , 
            plan_name=plan_selected.type , 
            limit_memory=plan_selected.limit_memory , 
            unity_memory=plan_selected.unity_memory , 
            name=new_user.nombre
            )
        )
    if res:
        await new_user.insert()
    return JSONResponse(
        content={
            "success" : "success in sign" , 
            "username" : new_user.username
            } , 
        status_code=status.HTTP_201_CREATED
        )

#Endpoint de Login al sistema
@app.post("/login")
async def login_on_sys(user_login : UserLogin, start_session_db = Depends(start_db)) -> Token:
    #Obtenemos el usuario por email
    user_in_db = await User.find_one(User.email == user_login.email)
    #Si no existe retornamos un error
    if user_in_db is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail={"reason" : "This email is not valid, try with other" , "email" : user_login.email})
    #Si no hace match el password enviado con el hash de la base de datos del usuario.
    if not context_crypt.verify_hash(user_login.password , user_in_db.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail={"reason" : "The password is not correct" , "password" : user_login.password})
    payload_token = TokenData(username=user_in_db.username , name=user_in_db.nombre , last_name=user_in_db.apellido)
    token = JwtFlow.generate_token(payload=payload_token , expire_token_on=timedelta(minutes=20))
    response = JSONResponse(content={"message": "Inicio de sesión exitoso", "username": user_in_db.username})
    response.set_cookie(
        key="session_jwt" , 
        value=token.access_token,
        httponly=True
        )
    return response

@app.get("/")
async def get_priv_resouce(token : Annotated[TokenData , Depends(authorization_schema)]):
    print(token)
    return {"Hello" : "World"}
#Ruta para solicitar restablecimiento de contraseña
@app.post("/request_reset_password")
async def request_reset_password_on_sys(email : EmailStr):
    #Obtener el usuario por email
    #Generar codigo de verificación
    #Insertar el codigo de verificación y el tiempo de expiración de este en la colección usuarios
    #Responder con el codigo de verificación del usuario.
    ...
@app.post("/reset_password")
async def reset_password_on_sys(email : EmailStr , new_password : str , code: str):
    #Obtener el usuario por email con su codigo de verificación
    #Obtener el tiempo actual y compararlo con el tiempo de expiración
    #Comparar el codigo enviado con el codigo de verificación generado para el usuario.
    #Si coinciden retornar el exito en el cambio de la contraseña.
    ...

#Ruta donde se envia la contraseña y se verifica que el codigo generado no expiro
