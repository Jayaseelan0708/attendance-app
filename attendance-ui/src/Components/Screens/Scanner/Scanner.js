import { View, Text, StyleSheet, StatusBar, Button } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../Store/AppContext'
import { CSS } from '../../../Assets/css/native_main_app';
import { BarCodeScanner, Constants } from 'expo-barcode-scanner';
import GlobalConstants from '../../../Constants/GlobalConstants';
import useRestService from '../../../Service/RestServiceHook';
import { getDistance } from '../../../Service/MethodFactory';

const Scanner = ({ navigation }) => {
    const RestService = useRestService();
    const appContext = useContext(AppContext);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [attendanceMarked, setAttendanceMarked] = useState(false); 

    // this method used to log attendance of users
    const logAttendance = (userData) => {
        try {
            let payload = {
                "companySid": appContext?.userDetails?.company?.sid || "",
                "userSid": appContext?.userDetails?.sid,
                "deviceId": appContext?.userDetails?.deviceId || "DEVICE-01",
                "type": "IN",
                "coordinate": `${userData?.latitude}, ${userData?.longitude}`,
                "mode": GlobalConstants.ATTENDANCE_MODE.QR_CODE
            }
            RestService.LogAttendance(payload, appContext?.userDetails?.authToken).then((res) => {
                alert("Attendance marked successfully");
                setAttendanceMarked(true);
                console.log("Marked successfully - ", res[0]);
            }).catch((err) => {
                console.error("Error ocurred while logAttendance() --" + err);
            })
        } catch (err) {
            console.error("Error ocurred while logAttendance() --" + err);
        }
    }

    // this method is used to calculate diff between two coordinate
    const validateDistance = (data) => {
        try {
            let userData = JSON.parse(data);
            let companyCoordinate = appContext?.userDetails?.company?.coordinate.split(",")
            if (userData.latitude && companyCoordinate?.[0]) {
                let distance = getDistance(userData.latitude, userData.longitude, companyCoordinate[0], companyCoordinate[1]);
                console.log(distance);
                if (distance && distance < 400) {
                    logAttendance(userData);
                } else {
                    alert("Invalid qr");
                }
            }
        } catch (err) {
            console.error("Error ocurred while validateDistance() --" + err);
        }
    }

    const getCameraPermission = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setScannedData(data);
        validateDistance(data);
    };

    useEffect(() => {
        getCameraPermission();
    }, []);

    return <View style={styles.container}>
        {
            hasPermission === null
            && <Text>Requesting for camera permission...</Text>
        }
        {
            hasPermission === false
            && <>
                <Text style={{ margin: 10 }}>No access to camera</Text>
                <Button title='Allow Camera' onPress={() => getCameraPermission()} />
            </>
        }
        {
            hasPermission
            && <>
                <View>
                    <View style={{ paddingVertical: 10 }}><Text style={{ fontSize: 16, fontWeight: 400 }}>Hello there!</Text></View>
                    <View style={{ paddingVertical: 5 }}><Text style={{ fontSize: 14, fontWeight: 600 }}>Show QR Code to the camera</Text></View>
                </View>
                <View style={styles.barCodeBox}>
                    <BarCodeScanner
                        type={Constants.Type.front}
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                </View>
                <Text style={{ fontSize: 16, margin: 10 }}>"Scanned: "{scannedData}</Text>
                {
                    attendanceMarked && <View>
                        <Text>Attendance marked successfully </Text>
                    </View>
                }
                {
                    scanned
                    && <Button
                        title={'Tap to Scan Again'}
                        onPress={() => {
                            setScanned(false);
                            setAttendanceMarked(false);
                        }}
                    />
                }
            </>
        }
    </View>
}

export default Scanner;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#fefefe',
        height: '100%',
        flexDirection: 'column',

    },
    barCodeBox: {
        width: 300,
        height: 300,
        // alignItems: 'center',
        // justifyContent: 'center',
        // overflow: 'hidden',
        borderRadius: 24,
        backgroundColor: CSS.COLOR.THEME_LIGHTER,
        // flexDirection: 'column',
        // position: 'relative'
    }
});
