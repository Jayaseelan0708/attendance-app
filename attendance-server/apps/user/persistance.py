from sqlalchemy import or_
from database.connection import session as database, exc    
import database.models as DatabaseModel
from datetime import datetime, timedelta
from uuid import uuid4
import apps.user.models as UserModel

def user_by_any(value: any) -> any:
    try:
        return database.query(DatabaseModel.User).filter(or_(DatabaseModel.User.emailId == value, DatabaseModel.User.mobile == value, DatabaseModel.User.sid == value)).one_or_none()
    except exc.SQLAlchemyError as sql_alchemy_error:
        database.rollback()
        raise sql_alchemy_error 
    except Exception:
        raise Exception

def user_by_email_mobile(email: str, mobile: str) -> any:
    try:
        return database.query(DatabaseModel.User).filter(or_(DatabaseModel.User.emailId == email, DatabaseModel.User.mobile == mobile)).one_or_none()
    except exc.SQLAlchemyError as sql_alchemy_error:
        database.rollback()
        raise sql_alchemy_error 
    except Exception:
        raise Exception

def save_otp(userSid: str, deviceId: str, otp: int) -> any:
    try:
        otp_record = DatabaseModel.OTPCode(sid=str(uuid4()).encode(),
            userSid=userSid,
            deviceId=deviceId,
            code=otp,
            expiresIn=datetime.utcnow() + timedelta(minutes=2)
        )
        database.add(otp_record)
        database.commit()
        database.refresh(otp_record)
        return otp_record.__dict__.get("sid")
    except exc.SQLAlchemyError as sql_alchemy_error:
        database.rollback()
        raise sql_alchemy_error 
    except Exception:
        raise Exception

def get_otp_by_sid(sid: str) -> any:
    try:
        return database.query(DatabaseModel.OTPCode).filter(DatabaseModel.OTPCode.sid == sid.encode()).one_or_none()
    except exc.SQLAlchemyError as sql_alchemy_error:
        database.rollback()
        raise sql_alchemy_error 
    except Exception:
        raise Exception
    
def increase_otp_attempts(sid: str):
    try:
        return database.query(DatabaseModel.OTPCode).filter(DatabaseModel.OTPCode.sid == sid.encode()).update({"attempts": DatabaseModel.OTPCode.attempts + 1})
    except exc.SQLAlchemyError as sql_alchemy_error:
        database.rollback()
        raise sql_alchemy_error 
    except Exception:
        raise Exception

def save_user(new_user: DatabaseModel.User, auth_token: str) -> UserModel.User:
    try:
        new_user.companySid = new_user.companySid.encode()
        user = DatabaseModel.User(
                **new_user.__dict__, createdBy=auth_token.encode(),
                        sid=str(uuid4()).encode())
        database.add(user)
        database.commit()
        database.refresh(user)
        return UserModel.User(**user.__dict__)
    except exc.SQLAlchemyError as sql_alchemy_error:
        database.rollback()
        raise sql_alchemy_error
    except Exception:
        raise Exception
    
#  query to delete the record if otp is verified
def delete_otp_record(sid: str):
    try:
        # return database.query(DatabaseModel.OTPCode).
        database.query(DatabaseModel.OTPCode).filter(sid.encode() == DatabaseModel.OTPCode.sid).delete()
        database.commit()
        return True
    except exc.SQLAlchemyError as sql_alchemy_error:
        database.rollback()
        raise sql_alchemy_error
    except Exception:
        raise Exception

def save_login_devices(deviceId: bytes, userSid: bytes) -> UserModel.LoginDevice:
    try:
        result = DatabaseModel.LoginDevice(sid = str(uuid4()).encode(), deviceId = deviceId, userSid = userSid)
        database.add(result)
        database.commit()
        database.refresh(result)
        temp_result = result.__dict__
        return UserModel.LoginDevice(**temp_result, timestamp=temp_result["dateTime"].timestamp() * 1000)
    except exc.SQLAlchemyError as sql_alchemy_error:
        database.rollback()
        raise sql_alchemy_error
    except Exception:
        raise Exception
    
def save_attendance(log_info: UserModel.NewLogAttendance):
    try:
        log_info.companySid = log_info.companySid.encode()
        log_info.userSid = log_info.userSid.encode()
        attendance_entry = DatabaseModel.UserLog(
                **log_info.__dict__, sid=str(uuid4()).encode())
        database.add(attendance_entry)
        database.commit()
        database.refresh(attendance_entry)
        temp_result = attendance_entry.__dict__
        return UserModel.LogAttendance(**temp_result, timestamp=temp_result["dateTime"].timestamp() * 1000)
    except exc.SQLAlchemyError as sql_alchemy_error:
        database.rollback()
        raise sql_alchemy_error
    except Exception as exception:
        print(exception)
        raise Exception
