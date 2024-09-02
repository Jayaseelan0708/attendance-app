import { View, Text, StyleSheet, StatusBar, Button } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../Store/AppContext'
import QRCode from 'react-native-qrcode-svg';
import { CSS } from '../../../Assets/css/native_main_app';
import * as Location from 'expo-location';
import * as ScreenCapture from 'expo-screen-capture';
import { useIsFocused } from '@react-navigation/native';

const Employee = ({ navigation }) => {
    let companyLogo = require('../../../Assets/Img/eserve-icon.png');
    const appContext = useContext(AppContext);
    const [data, setData] = useState();
    const [flag, setFlag] = useState(false);
    const isFocused = useIsFocused();
    
    // activate screenshot 
    const activate = async () => {
        await ScreenCapture.preventScreenCaptureAsync();
    };

    // deactivate screenshot 
    const deactivate = async () => {
        await ScreenCapture.allowScreenCaptureAsync();
    };

    // this is listening for current screen focus to activate or deactivate screenshot 
    useEffect(() => {
        isFocused ? activate() : deactivate();
    }, [isFocused])

    const getGeolocationDetails = () => {
        try {
            console.log("geoLocation", appContext?.geoLocation);
            setFlag(true);
        } catch (err) {
            console.error("Error getting from getGeolocationDetails --", err);
        }
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            appContext.setGeoLocation(location?.coords);
        })();
    }, []);

    useEffect(() => {
        let scanInfo = {
            "sid": appContext?.userDetails?.sid,
            "latitude": appContext?.geoLocation?.latitude,
            "longitude": appContext?.geoLocation?.longitude,
            "time": new Date().getTime(),
            "id": Math.random() * 10000 * 9999
        }
        setData(JSON.stringify(scanInfo));
        let qrInterval = setInterval(() => {
            scanInfo.id = Math.random() * 10000 * 9999;
            scanInfo.latitude = appContext?.geoLocation?.latitude,
            scanInfo.longitude = appContext?.geoLocation?.longitude,
            setData(JSON.stringify(scanInfo));
        }, 30 * 1000)
        return () => {
            clearInterval(qrInterval);
        }
    }, [appContext?.userDetails?.sid, appContext?.geoLocation?.latitude])

    return (
        <>
            <View style={styles.container}>
                {
                    data
                    && <View style={{ display: 'flex', flexDirection: 'column' }}>
                        <View style={{ paddingVertical: 20, alignItems: 'center' }}><Text style={{ fontSize: 24, color: CSS.COLOR.c777 }}>Mark Attendance</Text></View>
                        <View style={{ borderWidth: 8, borderColor: CSS.COLOR.c999, padding: 5 }}>
                            <QRCode
                                value={data}
                                logo={companyLogo}
                                logoSize={40}
                                logoBorderRadius={20}
                                logoBackgroundColor='transparent'
                                backgroundColor={'white'}
                                size={300}

                            />
                        </View>


                    </View>
                }
                <View style={{ alignItems: 'center', paddingVertical: 20, width: 300 }}>
                    <Text style={{ fontSize: 16, color: CSS.COLOR.c777, paddingTop: 5 }}>Scan this QR Code at the attendance tab to mark your attendance</Text>
                </View>
            </View>

            {/* <View style={{ paddingTop: 30 }}>
                <Button title="Geo Location" onPress={() => { getGeolocationDetails() }} />
            </View>

            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 25 }}>

                {flag &&
                    <Text>Geo Location is enable</Text>
                }
            </View> */}
        </>

    )
}

export default Employee;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#ecf0f1',
    }
});
