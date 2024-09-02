import { View, Text, StyleSheet, ScrollView, Linking, Modal } from 'react-native'
import React, { useContext, useState } from 'react'
import { Button } from '../../../Common/Buttons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Cards from '../../../Common/Cards/Cards'
import Circle from '../../../Common/Circle'
import CustomModal from '../../../Common/CustomModal'
import AppContext from '../../../Store/AppContext'
import { CSS } from '../../../Assets/css/native_main_app'

const Main = ({ navigation }) => {
    const appContext = useContext(AppContext);
    const [modalVisible, setModalVisible] = useState(false);


    return (<>
        <ScrollView>
            <View style={{ ...styles.container }}>
                <Cards onPress={() => navigation.navigate('Profile')}>
                    <View style={{
                        flexDirection: "row",
                        marginVertical: 15,
                        alignItems: "center",
                        justifyContent: "flex-start",
                    }}>
                        <View style={{ marginRight: 15, position: 'relative' }}>
                            <Circle>
                                <Text>{(appContext?.userDetails?.firstName?.charAt(0).toUpperCase() + appContext?.userDetails?.lastName?.charAt(0).toUpperCase()) || ""}</Text>
                            </Circle>
                        </View>

                        <View>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: '#111'
                                }}
                            >{appContext?.userDetails?.displayName || 'Rahul Kumar'}</Text>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ color: '#555', marginRight: 10, borderRightColor: 'lightgray', paddingRight: 10 }}>{appContext?.userDetails?.userRoles || "Employee"}</Text>
                            </View>
                        </View>
                    </View>
                </Cards>





                <Cards
                    onPress={() => setModalVisible(true)}
                >
                    <View style={{
                        flexDirection: "row",
                        marginVertical: 15,
                        alignItems: "center",
                        justifyContent: "flex-start",
                    }}>
                        <View>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: '#111'
                                }}
                            >Open Modal</Text>
                        </View>
                    </View>
                </Cards>

                <Button {...{
                    onPress: () => {
                        AsyncStorage.removeItem("userDetails");
                        appContext.setUserDetails({});
                    },
                    label: 'Logout',
                    textColor: 'white',
                    style: {
                        marginVertical: 20,
                        width: appContext.layoutInfo.width - 20,
                    }
                }} />
            </View>

        </ScrollView>
        {modalVisible && <CustomModal {...{ modalVisible, setModalVisible }} />}
    </>

    )
}

export default Main

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5
    },
    button: {
        alignItems: "center",
        backgroundColor: "#ddd",
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderWidth: 1,
        borderColor: '#dd5533',
        borderRadius: 6,
        width: 250,
    }
});