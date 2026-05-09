from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import buttons, execute, ws, utils

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(buttons.router)
app.include_router(execute.router)
app.include_router(ws.router)
app.include_router(utils.router)

app.mount("/", StaticFiles(directory="../client/dist", html=True), name="static")
