from fastapi import HTTPException, status
import apps.user.models as UserModel
from apps.company.models import Company
import apps.user.persistance as UserPersistence
from apps.company.service import company_by_sid
from datetime import datetime
import constant as Constant
import phonenumbers
import requests
import random
import re

class UserService:
    def create_user(self, new_user: UserModel.User, auth_token: str) -> UserModel.User:
        try:
            if (not bool(auth_token and not auth_token.isspace())):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=Constant.HTTP_INVALID_TOKEN)

            # Verifying passed company sid is valid or not
            company = company_by_sid(new_user.companySid)
            if (company is None):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=Constant.HTTP_INVALID_COMPANY_SID)

            # Verifying user is already registered with the company by passed email address or mobile number
            existing_user_info = UserPersistence.user_by_email_mobile(
                email=new_user.emailId, mobile=new_user.mobile)
            if (existing_user_info is not None):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT, detail=Constant.HTTP_ALREADY_REGISTERED)
            return UserPersistence.save_user(new_user, auth_token)
        except HTTPException as http_exception:
            raise HTTPException(
                status_code=http_exception.status_code, detail=http_exception.detail)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def send_otp(self, payload: UserModel.GenerateOTP) -> UserModel.GenerateOTPResponse:
        try:
            otp = random.randint(1000, 9999)
            response = None

            # To Makes sure user is present
            user = UserPersistence.user_by_any(payload.recipient.encode())
            if user is not None:
                match payload.recipientType:
                    case UserModel.OTPRecipientType.MOBILE:
                        parsedPhoneNumber = phonenumbers.parse(
                            payload.recipient)
                        if (phonenumbers.is_valid_number(parsedPhoneNumber)):
                            response = requests.get(
                                f"https://api.authkey.io/request?authkey=732911a293a76e78&mobile={parsedPhoneNumber.national_number}&country_code={parsedPhoneNumber.country_code}&sid=8232&otp={otp}")
                        else:
                            raise HTTPException(
                                status_code=status.HTTP_400_BAD_REQUEST, detail=Constant.HTTP_INVALID_MOBILE)
                    case UserModel.OTPRecipientType.EMAIL:
                        EmailRegex = re.fullmatch(
                            (r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+'), payload.recipient)
                        if (EmailRegex):
                            response = requests.get(
                                f"https://api.authkey.io/request?authkey=732911a293a76e78&email={payload.recipient}&mid=200&otp={otp}")
                        else:
                            raise HTTPException(
                                status_code=status.HTTP_400_BAD_REQUEST, detail=Constant.HTTP_INVALID_EMAIL)
                    case _:
                        raise HTTPException(
                            status_code=status.HTTP_417_EXPECTATION_FAILED, detail=Constant.HTTP_INVALID_RECIPIENT_TYPE)
                
                if response is not None and response.status_code == 200:
                    otpSid = UserPersistence.save_otp(userSid=user.sid,
                                                      deviceId=payload.deviceId, otp=otp)
                    if (otpSid is not None):
                        return UserModel.GenerateOTPResponse(sid=otpSid)
                else:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail=Constant.HTTP_USER_NOT_FOUND)
        except HTTPException as http_exception:
            raise HTTPException(
                status_code=http_exception.status_code, detail=http_exception.detail)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def verify_otp(self, payload: UserModel.VerifyOTP) -> UserModel.User:
        try:
            otp_info = UserPersistence.get_otp_by_sid(sid=payload.sid)
            if otp_info is not None:
                # Python variables are reference based since taking the copy of the otp record
                otp_info = otp_info.__dict__.copy()
                if otp_info["code"] == payload.otp:
                    if datetime.utcnow() <= otp_info["expiresIn"]:
                        user = UserPersistence.user_by_any(
                            otp_info.get("userSid"))
                        if user is not None:
                            # Python variables are reference based since taking the copy of user record
                            user = user.__dict__.copy()
                            company = company_by_sid(
                                user["companySid"].decode())
                            if company is not None:
                                # Python variables are reference based since taking the copy of company record
                                company = company.__dict__.copy()
                                # Deleting the record since OTP verified successfully
                                if UserPersistence.delete_otp_record(payload.sid):
                                    login_device = UserPersistence.save_login_devices(
                                        userSid=otp_info["userSid"], deviceId=otp_info["deviceId"])
                                    if (login_device is not None):
                                        return UserModel.User(**user, authToken=login_device.__dict__["sid"], company=Company(**company))
                                else:
                                    raise HTTPException(
                                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=Constant.HTTP_UNABLE_DELETE_OTP)
                            else:
                                raise HTTPException(
                                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=Constant.HTTP_COMPANY_NOT_FOUND)
                        else:
                            raise HTTPException(
                                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=Constant.HTTP_USER_NOT_FOUND)
                    else:
                        # Deleting the record since OTP expired
                        UserPersistence.delete_otp_record(payload.sid)
                        raise HTTPException(
                            status_code=status.HTTP_410_GONE, detail=Constant.HTTP_OTP_EXPIRED)
                else:
                    if ((otp_info["attempts"] + 1) < 3):
                        UserPersistence.increase_otp_attempts(payload.sid)
                        raise HTTPException(
                            status_code=status.HTTP_403_FORBIDDEN, detail=f"{3 - (otp_info['attempts'] + 1)} attempt is left")
                    else:
                        # Deleting the record since 3 attempt is over
                        UserPersistence.delete_otp_record(payload.sid)
                        raise HTTPException(
                            status_code=status.HTTP_403_FORBIDDEN, detail=Constant.HTTP_MAX_ATTEMPTS_EXCEEDED)
            else:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail=Constant.HTTP_INVALID_OTP_SID)
        except HTTPException as http_exception:
            raise HTTPException(
                status_code=http_exception.status_code, detail=http_exception.detail)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def log_attendance(self, log_info: UserModel.NewLogAttendance, auth_token: str) -> UserModel.LogAttendance:
        try:
            if (not bool(auth_token and not auth_token.isspace())):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=Constant.HTTP_INVALID_TOKEN)

            user = UserPersistence.user_by_any(log_info.userSid.encode())
            if user is not None:
                return UserPersistence.save_attendance(log_info)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=Constant.HTTP_USER_NOT_FOUND)
        except HTTPException as http_exception:
            raise HTTPException(
                status_code=http_exception.status_code, detail=http_exception.detail)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
