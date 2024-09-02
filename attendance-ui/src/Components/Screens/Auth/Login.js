import React, { useState, useRef, useEffect, useContext } from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Modal,
    FlatList,
    TouchableWithoutFeedback,
    Image,
    TouchableOpacity,
    TextInput,
    StatusBar,
    Platform,
} from 'react-native'
import { Countries } from './Countries';
import AppContext from '../../../Store/AppContext';
import * as Location from 'expo-location';
import * as Application from 'expo-application';
import useRestService from '../../../Service/RestServiceHook';
import GlobalConstants from '../../../Constants/GlobalConstants';
import AppUtils from '../../../AppUtils';
import { CSS } from '../../../Assets/css/native_main_app'
const source = {
    uri:
        'https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png',
};


const Login = ({ navigation }) => {
    const RestService = useRestService();
    const { geoLocation, setGeoLocation, deviceId, setDeviceId } = useContext(AppContext);
    let textInput = useRef(null);
    const defaultCountryCode = "+91"
    const defaultMaskCountry = "Mobile number or email"
    const [value, setValue] = useState();
    const [focusInput, setFocusInput] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [dataCountries, setDataCountries] = useState(Countries);
    const [countryCode, setCountryCode] = useState(defaultCountryCode);
    const [placeholder, setPlaceholder] = useState(defaultMaskCountry);
    const [errorMessage, setErrorMessage] = useState("");

    const [errorMsg, setErrorMsg] = useState(null);

    const onShowHideModal = () => {
        setModalVisible(!modalVisible);
    }

    const onChangePhone = (val) => {
        if (AppUtils.isNotEmpty(errorMessage)) setErrorMessage("");
        setValue(val);
    }

    const onPressContinue = () => {
        try {
            requestOtp();
        } catch (err) {
            console.error("Error getting onPressContinue --", err);
        }
    }

    const onChangeFocus = () => {
        setFocusInput(true);
    }

    const onChangeBlur = () => {
        setFocusInput(false);
    }

    let renderModal = () => {
        return (
            <Modal animationType='slide' transparent={false} visible={modalVisible}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.modalContainer}>
                        <View style={styles.filterInputContainer}>
                            <TextInput
                                autoFocus={true}
                                onChangeText={filterCountries}
                                placeholder={'Filter'}
                                focusable={true}
                                style={styles.filterInputStyle}
                            />
                        </View>

                        <FlatList
                            style={{ flex: 1 }}
                            data={dataCountries}
                            extraData={dataCountries}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={
                                ({ item }) => (
                                    <TouchableWithoutFeedback onPress={() => onCountryChange(item)}>
                                        <View style={styles.countryModalStyle}>
                                            <View style={styles.modalItemContainer}>
                                                <Text style={styles.modalItemName}>{item.en}</Text>
                                                <Text style={styles.modalItemDialCode}>{item.dialCode}</Text>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                )
                            }
                        />

                    </View>
                    <TouchableOpacity onPress={onShowHideModal} style={styles.closeButtonStyle}>
                        <Text style={styles.closeTextStyle}>{'Close'}</Text>
                    </TouchableOpacity>

                </SafeAreaView>

            </Modal>
        )
    }

    const filterCountries = (value) => {
        if (value) {
            const countryData = dataCountries.filter((obj) => (obj.en.indexOf(value) > -1 || obj.dialCode.indexOf(value) > -1))
            setDataCountries(countryData)
        } else {
            setDataCountries(Countries)
        }
    }

    const onCountryChange = (item) => {
        setCountryCode(item.dialCode)
        setPlaceholder(item.mask)
        onShowHideModal()
    }


    /**
     * this method to used to request an otp 
     */
    const requestOtp = () => {
        try {
            let payload = {
                "recipientType": "",
                "recipient": "",
                "deviceId": deviceId || Date.now()
            }

            if (value && !isNaN(value) && value.length >= 10) {
                payload.recipient = countryCode + value;
                payload.recipientType = GlobalConstants.RECIPIENT_TYPE.MOBILE;
            } else if (AppUtils.isEmail(value)) {
                payload.recipient = value;
                payload.recipientType = GlobalConstants.RECIPIENT_TYPE.EMAIL;
            } else {
                setErrorMessage("Please enter valid mobile or email!");
                return;
            }

            RestService.RequestOtp(payload).then((res) => {
                navigation.navigate('InputOTPScreen', { "otpSid": res[0].sid });
            }).catch((err) => {
                if (err && err?.[0]?.detail) {
                    setErrorMessage(err[0].detail || "Mobile/Email address not found");
                }
                console.error("Error ocurred while requestOtp() --" + err);
            })
        } catch (err) {
            console.error("Error ocurred while requestOtp() --" + err);
        }
    }

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setGeoLocation(location?.coords);
        })();
    }, []);

    useEffect(() => {
        if (Platform.OS === 'ios') {
            setDeviceId(Application?.getIosIdForVendorAsync)
        } else if (Platform.OS === 'android') {
            setDeviceId(Application?.androidId)
        }
    }, []);

    useEffect(() => {
        textInput.focus();

    }, []);



    return (
        <>
            <View style={styles.container}>
                <KeyboardAvoidingView
                    keyboardVerticalOffset={50}
                    behavior={'padding'}
                    style={styles.containerAvoidingView}
                >
                    <Image style={styles.icon} source={source} />
                    <Text style={styles.subTitle}>
                        Please enter your register mobile number or email id{'\n'}

                    </Text>
                    <View style={{ paddingHorizontal: 20, alignItems: 'center', flex: 1 }}>
                        <View style={[
                            styles.containerInput,
                            {
                                borderColor: CSS.COLOR.THEME,
                            }
                        ]}>
                            {
                                value
                                && !isNaN(value)
                                && <TouchableOpacity onPress={onShowHideModal}>
                                    <View style={styles.openDialogView}>
                                        <Text>{countryCode}</Text>
                                        <View style={{ borderRightWidth: 1, marginHorizontal: 10, color: 'black', height: 20 }}></View>
                                    </View>
                                </TouchableOpacity>
                            }
                            <TextInput
                                ref={(input) => textInput = input}
                                style={styles.phoneInputStyle}
                                placeholder={placeholder}
                                value={value}
                                onChangeText={onChangePhone}
                                secureTextEnter={false}
                                onFocus={onChangeFocus}
                                onBlur={onChangeBlur}
                                autoFocus={focusInput}
                            />
                        </View>
                        <View style={{ paddingTop: 5 }}>
                            <Text style={{ color: 'red', fontSize: 12 }}>{errorMessage}</Text>
                        </View>
                        <View style={styles.editContainer}>
                            <TouchableOpacity onPress={onPressContinue} style={[
                                styles.btnContinue,
                                {
                                    backgroundColor: (isNaN(value) && AppUtils.isEmail(value)) || (!isNaN(value) && value?.length >= 10) ? CSS.COLOR.THEME : 'gray',
                                }
                            ]}>
                                <Text style={styles.txtContinue}>Send OTP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </KeyboardAvoidingView>
            </View>
            {renderModal()}
        </>
    )
}
export default Login;



let styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    containerAvoidingView: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 20,

        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    textTittle: {
        marginBottom: 50,
        marginTop: 50,
        fontSize: 16,
    },
    containerInput: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        borderBottomWidth: 1.5,
    },
    openDialogView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    phoneInputStyle: {
        flex: 1,
        height: 40,
        outlineStyle: 'none'
    },
    viewBottom: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        padding: 20,
    },
    btnContinue: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        borderRadius: 4
    },
    txtContinue: {
        color: '#FFFFFF',
        alignItems: 'center',
    },
    modalContainer: {
        paddingTop: 15,
        paddingLeft: 25,
        paddingRight: 25,
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    filterInputStyle: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#FFFFFF",
        color: '#424242'
    },
    countryModalStyle: {
        flex: 1,
        borderColor: '#000000',
        borderTopWidth: 1,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    modalItemContainer: {
        flex: 1,
        paddingLeft: 5,
        flexDirection: 'row',
    },
    modalItemName: {
        flex: 1,
        fontSize: 16,
    },
    modalItemDialCode: {
        fontSize: 16,
    },
    filterInputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonStyle: {
        padding: 12,
        alignItems: 'center',
    },
    closeTextStyle: {
        padding: 5,
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },

    title: {
        paddingTop: 50,
        color: '#000',
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'center',
    },
    subTitle: {
        paddingTop: 30,
        color: '#000',
        textAlign: 'center',
        paddingBottom: 30,
    },
    icon: {
        width: 217 / 2.4,
        height: 158 / 2.4,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    editContainer: {
        marginTop: 15,
        padding: 20,
        paddingLeft: 25,
        paddingRight: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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

});
