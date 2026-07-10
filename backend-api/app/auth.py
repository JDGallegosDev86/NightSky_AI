from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError, ExpiredSignatureError
from passlib.context import CryptContext


# Secret key used to sign and verify JWT tokens
SECRET_KEY = "nightsky_super_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Password hashing setup
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# JWT Bearer security setup
security = HTTPBearer()


# Hashes a password before storing it in the database
def hash_password(password: str):
    return pwd_context.hash(password[:72])


# Compares the entered password with the stored password hash
def verify_password(
    plain_password: str,
    hashed_password: str
):
    return pwd_context.verify(
        plain_password[:72],
        hashed_password
    )


# Creates a signed JWT access token
def create_access_token(data: dict):
    to_encode = data.copy()

    # JWT expiration times must use UTC
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


# Verifies the JWT token sent by the frontend
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")

        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Token does not contain a user email"
            )

        return email

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired. Please log in again."
        )

    except JWTError as error:
        print("JWT verification error:", str(error))

        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )