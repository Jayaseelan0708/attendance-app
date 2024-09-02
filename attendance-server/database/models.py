from sqlalchemy import Column, Integer, VARCHAR, DateTime, ForeignKey, Enum, BINARY, Boolean
from database.connection import Base, db_engine
from sqlalchemy.sql import func
from apps.user.models import Role, LogType, LogMode

class xCompany(Base):
    __tablename__ = 'company'
    id = Column(Integer, primary_key=True, autoincrement=True)
    sid = Column(BINARY(36), unique=True)
    name = Column(VARCHAR(250), nullable=False)
    emailId = Column(VARCHAR(100), nullable=False)
    address = Column(VARCHAR(250), nullable=False)
    coordinate = Column(VARCHAR(50), nullable=False)
    isActive = Column(Boolean, default=False)
    isVerified = Column(Boolean, default=False)

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    sid =  Column(BINARY(36), unique=True)
    companySid = Column(BINARY(36), ForeignKey("company.sid"), nullable=False)
    firstName = Column(VARCHAR(50), nullable=False)
    lastName = Column(VARCHAR(50), nullable=False)
    dob = Column(VARCHAR(10), nullable=False)
    mobile = Column(VARCHAR(15), nullable=False)
    emailId = Column(VARCHAR(100), nullable=False)
    password = Column(VARCHAR(255), nullable=True)
    isActive = Column(Boolean, default=True)
    role = Column(Enum(Role, nullable=False))
    createdBy = Column(VARCHAR(50), nullable=False)
    updatedBy = Column(VARCHAR(50), nullable=True)
    createdOn = Column(DateTime(timezone=True), default=func.now())
    updatedOn = Column(Integer, nullable=True)
    displayPicture = Column(VARCHAR(150), nullable=True)

class OTPCode(Base):
    __tablename__ = 'otp_codes'
    id = Column(Integer, primary_key=True, autoincrement=True)
    sid = Column(BINARY(36), unique=True)
    userSid = Column(BINARY(36), ForeignKey("users.sid"), nullable=False)
    deviceId = Column(VARCHAR(50), nullable=False)
    code = Column(Integer, nullable=False)
    expiresIn = Column(DateTime, nullable=False)
    attempts = Column(Integer, nullable=False, default=0)

class LoginDevice(Base):
    __tablename__ = 'login_devices'
    id = Column(Integer, primary_key=True, autoincrement=True)
    sid = Column(BINARY(36), unique=True)
    userSid = Column(BINARY(36), ForeignKey("users.sid"), nullable=False)
    deviceId = Column(VARCHAR(50), nullable=False)
    dateTime = Column(DateTime (timezone=True), default=func.now())
    isActive = Column(Boolean, default=True)
    isMobile = Column(Boolean, default=False, nullable=True)
    deviceInfo = Column(VARCHAR(250), nullable=True)

class UserLog(Base):
    __tablename__ = 'user_logs'
    id = Column(Integer, primary_key=True, autoincrement=True)
    sid = Column(BINARY(36), unique=True)
    companySid = Column(BINARY(36), ForeignKey("company.sid"), nullable=False)
    userSid = Column(BINARY(36), ForeignKey("users.sid"), nullable=False)
    deviceId = Column(VARCHAR(50), nullable=False)
    dateTime = Column(DateTime (timezone=True), default=func.now())
    type = Column(Enum(LogType), nullable=False)
    coordinate = Column(VARCHAR(150), nullable=False)
    mode = Column(Enum(LogMode), nullable=False)

Base.metadata.create_all(db_engine)