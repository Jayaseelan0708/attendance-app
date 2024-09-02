from fastapi import APIRouter, status, HTTPException, Header
import apps.user.models as UserModel
from apps.user.service import UserService
from typing import Annotated

router = APIRouter(prefix="/user")

# Creates a new user
@router.post("/create")
async def create_user(new_user: UserModel.NewUser, auth_token: Annotated[str | None, Header()] = None) -> UserModel.User:
    try:
        return UserService().create_user(new_user, auth_token)
    except HTTPException as http_exception:
        raise HTTPException(status_code=http_exception.status_code, detail=http_exception.detail)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# Sends the OTP
@router.post("/otp/generate")
async def generate_otp(payload: UserModel.GenerateOTP) -> UserModel.GenerateOTPResponse:
    try:
        return UserService().send_otp(payload)
    except HTTPException as http_exception:
       raise HTTPException(status_code=http_exception.status_code, detail=http_exception.detail)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# Verifies the otp
@router.post("/otp/verify")
async def verify_otp(payload: UserModel.VerifyOTP) -> UserModel.User:
    try:
        return UserService().verify_otp(payload)
    except HTTPException as http_exception:
        raise HTTPException(status_code=http_exception.status_code, detail=http_exception.detail)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# creates the user attendence
@router.post("/attendance/create")
async def log_attendance(payload: UserModel.NewLogAttendance, auth_token: Annotated[str | None, Header()] = None):
    try:
        return UserService().log_attendance(payload, auth_token)
    except HTTPException as http_exception:
        raise HTTPException(status_code=http_exception.status_code, detail=http_exception.detail)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)