
import { useContext } from 'react'
import AppUtils from '../AppUtils';
import GLOBAL_CONSTANTS from '../Constants/GlobalConstants';
import AppContext from '../Store/AppContext';
import GlobalConstants from '../Constants/GlobalConstants';

export default function useRestService() {
    const appContext = useContext(AppContext);

    /**
    * This method used to add Authorization token with passed headers
    * @param {Object} headers - Headers object
    */
    const getHeaders = (headers = {}) => {
        try {
            let temp = AppUtils.isEmptyObject(headers) ? {} : headers;
            if (!temp.hasOwnProperty("auth-token"))
                temp["auth-token"] = appContext?.userDetails?.authToken;
            return temp
        } catch (err) {
            return { "auth-token": appContext?.userDetails?.authToken }
        }
    }

    return {
        RequestOtp: (payload) => AppUtils.httpPost(GLOBAL_CONSTANTS.APIS.GET_OTP, payload),
        VerifyOtp: (payload) => AppUtils.httpPost(GLOBAL_CONSTANTS.APIS.VERIFY_OTP, payload),
        CreateUser: (payload) => AppUtils.httpPost(GLOBAL_CONSTANTS.APIS.CREATE_USER, payload),
        GetCompany: (sid) => AppUtils.httpGet(GLOBAL_CONSTANTS.APIS.GET_COMPANY_INFO + sid),
        LogAttendance: (payload) => AppUtils.httpPost(GlobalConstants.APIS.LOG_ATTENDANCE, payload, getHeaders())
    }
}