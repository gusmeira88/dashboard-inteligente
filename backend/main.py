from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import startup
from routes_produtos import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    startup()


app.include_router(router)
