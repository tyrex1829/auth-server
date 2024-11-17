from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import random

app = FastAPI()

def getToken():
    return str(random.random())

class Item(BaseModel):
    username: str
    password: str

users = []

@app.get("/")
async def home():
    return {"message": "Welcome to the server"}

@app.get("/users")
async def get_users():
    data = {"users": users}
    return JSONResponse(content=data, status_code=200)

@app.post("/signup")
async def signup(item: Item):
    user = next((u for u in users if u["username"] == item.username), None)

    if user:
        data = {"message": "User with the same username is already present"}
        return JSONResponse(content=data, status_code=500)
    else:
        users.append({
            "username": item.username, "password": item.password, "token": None
        })
        data = {"message": "Successfully Signed-up"}
        return JSONResponse(content=data, status_code=200)
    
@app.post("/signin")
async def signin(item: Item):
    user = next((u for u in users if u["username"] == item.username and u["password"] == item.password), None)

    if user:
        user["token"] = getToken()
        data = {"message": "Successfully Signed-in", "user": user}
        return JSONResponse(content=data, status_code=401)
    
    else:
        data = {"message": "Invalid username or password"}
        return JSONResponse(content=data, status_code=400)

import uvicorn
uvicorn.run(app)