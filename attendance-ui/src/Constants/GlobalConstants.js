
const HOSTNAME = "http://52.90.146.18:8000";

export default (() => {
    return Object.freeze({
        ROLE: {
            ADMIN: "ADMIN",
            USER: "USER",
            SCANNER: "SCANNER"
        },
        RECIPIENT_TYPE: {
            MOBILE: "MOBILE", 
            EMAIL: "EMAIL"
        },
        ATTENDANCE_MODE: {
            QR_CODE: "QR_CODE"
        },
        APIS: {
            GET_OTP: HOSTNAME + "/user/otp/generate",
            VERIFY_OTP: HOSTNAME + "/user/otp/verify",
            CREATE_USER: HOSTNAME + "/user/create",
            CREATE_COMPANY: HOSTNAME + "/company/create",
            GET_COMPANY_INFO: HOSTNAME + "/company/get/",
            LOG_ATTENDANCE: HOSTNAME + "/user/attendance/create"
        }
    })
})()