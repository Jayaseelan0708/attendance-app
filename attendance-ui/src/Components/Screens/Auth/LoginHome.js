import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const source = {
    uri:
        'https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png',
};

const LoginHome = ({ navigation }) => {


    const onPressMobile = () => {
        navigation.navigate('Login');
    }

    

    return (
        <SafeAreaView style={styles.container}>
            {/* <Text style={styles.title}>Welcome</Text> */}
            <Image style={styles.icon} source={source} />
            {/* <Text style={styles.subTitle}>
                Please enter the verification code{'\n'}
                we send to your mobile number
            </Text> */}

            <View style={styles.viewBottom}>
                <TouchableOpacity onPress={onPressMobile}>
                    <View style={[
                        styles.btnContinue,
                        {
                            backgroundColor: '#244DB7',
                        }
                    ]}>
                        <Text style={styles.txtContinue}>Login with Mobile</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View>
                <Text>OR</Text>
            </View>

            <View style={styles.viewBottom}>
                <TouchableOpacity>
                    <View style={[
                        styles.btnContinue,
                        {
                            backgroundColor: '#87CEEB',
                        }
                    ]}>
                        <Text style={styles.txtContinue}>Login with E-mail</Text>
                    </View>
                </TouchableOpacity>
            </View>


        </SafeAreaView>
    );
};

export default LoginHome;

let styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
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


    viewBottom: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        // marginBottom: 50,
    },
    btnContinue: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#244DB7',
        width: 200,
    },
    txtContinue: {
        color: '#FFFFFF',
        alignItems: 'center'
    },

})
