from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional

from backend.db.database import get_db
from backend.models.user_model import User
from backend.utils.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/auth/login', auto_error=False)

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Could not validate credentials or session has expired.',
        headers={'WWW-Authenticate': 'Bearer'},
    )
    if not token:
        raise credentials_exception

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    username: str = payload.get('sub')
    if username is None:
        raise credentials_exception

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Your account is currently inactive. Please contact the administrator.'
        )

    return user

def get_optional_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not token:
        return None
    payload = decode_access_token(token)
    if payload is None:
        return None
    username = payload.get('sub')
    if not username:
        return None
    user = db.query(User).filter(User.username == username).first()
    if user and user.is_active:
        return user
    return None

def require_central_authority(
    current_user: User = Depends(get_current_user)
) -> User:
    if current_user.authority_type != 'CENTRAL_AUTHORITY':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Access restricted. Central Authority privileges required.'
        )
    return current_user

def require_state_authority(
    current_user: User = Depends(get_current_user)
) -> User:
    if current_user.authority_type != 'STATE_AUTHORITY':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Access restricted. State Authority privileges required.'
        )
    return current_user
