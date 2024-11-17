from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def home():
    return {"message": "Welcome to the server"}

import uvicorn
uvicorn(app)