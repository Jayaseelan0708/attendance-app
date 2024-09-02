import React, { useState, useEffect, useContext } from 'react';
import {
    SafeAreaView, 
    Text, 
    View, 
    StyleSheet, 
    Image, 
    TouchableOpacity,
    StatusBar
} from 'react-native';
import AppContext from '../../../Store/AppContext';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import useRestService from '../../../Service/RestServiceHook';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CELL_COUNT = 4;
const source = {
    uri:
        'https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png',
};

const InputOTPScreen = ({ navigation, route }) => {
    const { otpSid } = route.params;
    const RestService = useRestService();
    const appContext = useContext(AppContext);
    const defaultCountDown = 30;
    let clockCall = null;
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const [countDown, setCountDown] = useState(defaultCountDown);
    const [enableResend, setEnableResend] = useState(false);

    const decrementClock = () => {
        if (countDown === 0) {
            setEnableResend(true);
            setCountDown(0);
            clearInterval(clockCall)
        } else {
            setCountDown(countDown - 1);
        }
    }

    const onResendOTP = () => {
        if (enableResend) {
            setCountDown(defaultCountDown);
            setEnableResend(false);
            clearInterval(clockCall)
            clockCall = setInterval(() => {
                decrementClock();
            }, 1000)
        }
    }

    const onChangeNumber = () => {
        navigation.navigate('Login')
    }

    // this method used to validate otp which has been sent to mobile/email
    const onVerifyOTP = () => {
        try {
            if (value.length >= 4) {
                let payload = {
                    "otp": value,
                    "sid": otpSid || ""
                  }
                RestService.VerifyOtp(payload).then((res) => {
                    let response = {
                        ...res[0],
                        "displayName": res[0].firstName + " " + res[0].lastName
                    }
                    appContext.setUserDetails(response);
                    AsyncStorage.setItem("userDetails", JSON.stringify(response));
                    console.log(res[0]);
                }).catch((err) => {
                    console.error("Error ocurred while verifyOtp() --" + err);
                })
            }
        } catch (err) {
            console.error("Error ocurred while verifyOtp() --" + err);
        }
    }

    useEffect(() => {
        clockCall = setInterval(() => {
            decrementClock();
        }, 1000)
        return () => {
            clearInterval(clockCall);
        }
    })

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Verification</Text>
            <Image style={styles.icon} source={source} />
            <Text style={styles.subTitle}>
                Please enter the One Time Password(OTP) {'\n'}
                which we have sent to your mobile number. Please enter to complete your verification
            </Text>
            <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                    <View
                        // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                        onLayout={getCellOnLayoutHandler(index)}
                        key={index}
                        style={[styles.cellRoot, isFocused && styles.focusCell]}>
                        <Text style={styles.cellText}>
                            {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                    </View>
                )}
            />
            <View style={styles.editContainer}>
                <TouchableOpacity style={styles.editNumber} onPress={onChangeNumber}>
                    <Text style={{ color: '#234DB7' }}>Change {value && !isNaN(value) ? "number" : "email"} ?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.resendOtp} onPress={onResendOTP}>
                    <Text style={{ color: enableResend ? '#234DB7' : 'gray' }}>Resend OTP ({countDown})</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.viewBottom}>
                <TouchableOpacity onPress={onVerifyOTP}>
                    <View style={[
                        styles.btnContinue,
                        {
                            backgroundColor: value?.length >= 4 ? CSS.COLOR.THEME : 'gray',
                        }
                    ]}>
                        <Text style={styles.txtContinue}>Verify OTP</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default InputOTPScreen;

let styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#FFFFFF',
        padding: 10
    },

    title: {
        paddingTop: 50,
        color: '#000',
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'center',
        paddingBottom: 40,
    },

    icon: {
        width: 217 / 2.4,
        height: 158 / 2.4,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    subTitle: {
        paddingTop: 30,
        color: '#000',
        textAlign: 'center',
    },

    textTittle: {
        marginBottom: 50,
        marginTop: 50,
        fontSize: 16,
    },

    codeFieldRoot: {
        marginTop: 20,
        width: 280,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    cellRoot: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    cellText: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
    },
    focusCell: {
        borderBottomColor: '#007AFF',
        borderBottomWidth: 2,
    },

    viewBottom: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        // marginBottom: 50,
    },
    btnContinue: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        borderRadius: 4
    },
    txtContinue: {
        color: '#FFFFFF',
        alignItems: 'center'
    },
    editContainer: {
        marginTop: 5,
        padding: 20,
        paddingLeft: 25,
        paddingRight: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    editNumber: {
        color: '#3B71CA',
        flex: 1,
        justifyContent: 'center',
    },
    resendOtp: {
        flex: 1,
        justifyContent: 'center',
        color: '#3B71CA',
    }
})
