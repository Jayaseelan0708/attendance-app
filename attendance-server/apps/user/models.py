from pydantic import BaseModel
from enum import Enum
from typing import Optional
from apps.company.models import Company
from datetime import datetime

class LogType(Enum):
    IN = "IN"
    OUT = "OUT"

class LogMode(Enum):
    QR_CODE = "QR_CODE"
    BLUETOOTH = "BLUETOOTH"
    GEO_FENCE = "GEO_FENCE"
    
class Role(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"
    SCANNER = "SCANNER"
    
class OTPRecipientType(str, Enum):
    MOBILE: str = "MOBILE"
    EMAIL: str = "EMAIL"

class GenerateOTP(BaseModel):
    recipientType: OTPRecipientType
    recipient: str
    deviceId: str

class GenerateOTPResponse(BaseModel):
    message: str = "OTP has been sent successfully!"
    sid: str

class OtpModel(BaseModel):
    id: int
    sid: str
    userSid: str
    deviceSid: str
    code: int
    expiresIn: int

class VerifyOTP(BaseModel):
    otp: int
    sid: str

class NewUser(BaseModel):
    companySid: str
    firstName: str
    lastName: str
    dob: str
    mobile: str
    emailId: str
    role: Role

class User(NewUser):
    sid: str
    authToken: Optional[str] = None
    company: Optional[Company] = None
    
class LoginDevice(BaseModel):
    sid: str
    userSid: str
    deviceId: str
    dateTime: datetime
    isActive: bool
    isMobile: bool
    deviceInfo: Optional[str] = None
    timestamp: Optional[int] = None

class NewLogAttendance(BaseModel):
    companySid: str
    userSid: str
    deviceId: str
    type: LogType
    coordinate: str
    mode: LogMode

class LogAttendance(NewLogAttendance):
    sid: str
    timestamp: int
