from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio

router = APIRouter()

@router.websocket("/ws")
async def websocket_heartbeat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await websocket.send_text("heartbeat") 
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        pass