from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter()

fake_users_db = {}


class UserRegister(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


@router.post("/register")
def register_user(user: UserRegister):
    if user.email in fake_users_db:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    hashed_password = hash_password(user.password)

    fake_users_db[user.email] = {
        "email": user.email,
        "hashed_password": hashed_password
    }

    return {
        "message": "User registered successfully"
    }


@router.post("/login")
def login_user(user: UserLogin):
    db_user = fake_users_db.get(user.email)

    if db_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token({
        "sub": user.email
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }