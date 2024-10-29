import asyncio
import websockets
import json

async def test_websocket():
    uri = "ws://localhost:8000/cloud/share/ws/notifications/cancinod080@gmail.com"  # Cambia a la URL correcta
    async with websockets.connect(uri) as websocket:
        print("Conexión WebSocket abierta")
        message_sender = {
            'event' : 'transfer_resource' , 
            'from' : 'cancinod080@gmail.com', 
            'to' : 'tomas@gmail.com'
        }
        await websocket.send(json.dumps(message_sender))
        # Recibir mensaje del servidor
        while True:
            message = await websocket.recv()
            print(f"Mensaje recibido del servidor: {message}")

# Ejecuta el cliente WebSocket
asyncio.run(test_websocket())
