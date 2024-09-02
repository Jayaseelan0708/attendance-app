import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';

const AppContext = createContext({});
export default AppContext;
export const AppConsumer = AppContext.Consumer

export const AppProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState({});
    const [geoLocation, setGeoLocation] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [companyInfo, setCompanyInfo] = useState(null);

    const layoutInfo = {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    }

     // this method is use to check - user is logged in or not
     const isLoggedIn = async () => {
        try {
            let userInfo = await AsyncStorage.getItem("userDetails");
            console.log(userInfo);
            if(userInfo) {
                setUserDetails(JSON.parse(userInfo));
            }
        } catch (err) {
            console.log("Error occurred in isLoggedIn--", err);
        }
    }

    useEffect(() => {
        isLoggedIn();
    }, [])

    const appData = {
        userDetails,
        setUserDetails,
        layoutInfo,
        geoLocation, 
        setGeoLocation,
        deviceId, 
        setDeviceId,
        companyInfo, 
        setCompanyInfo
    }

    return <AppContext.Provider value={{ ...appData }}>
        {children}
    </AppContext.Provider>
}