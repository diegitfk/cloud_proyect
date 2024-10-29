import asyncio
import json
import websockets

async def receiver_socket():
    uri = "ws://localhost:8000/cloud/share/ws/notifications/diegoxd"
    async with websockets.connect(uri) as websocket:
        print("Conexión Websocket abierta")
        while True:
            message = await websocket.recv()
            print(json.loads(message))

asyncio.run(receiver_socket())
