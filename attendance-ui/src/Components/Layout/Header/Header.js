import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import AppContext from '../../../Store/AppContext'
import { CSS } from '../../../Assets/css/native_main_app'

const Header = ({ navigation }) => {
    const appContext = useContext(AppContext);
    return <View style={{
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        backgroundColor: CSS.COLOR.THEME,
        paddingHorizontal: 15
    }}>
        <View style={{
            flexDirection: "row",
            marginVertical: 12,
            alignItems: "center",
            justifyContent: "flex-start",

        }}>
            <View style={{ position: 'relative' }}>
                <TouchableOpacity onPress={() => { navigation.navigate('MainProfile'); }} style={{ borderRadius: 20, borderColor: 'white', borderWidth: 2, height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white' }}>{(appContext?.userDetails?.firstName?.charAt(0).toUpperCase() + appContext?.userDetails?.lastName?.charAt(0).toUpperCase()) || ""}</Text>
                </TouchableOpacity>
            </View>


            <View style={{ paddingLeft: 10}}>
                <Text
                    style={{
                        fontSize: 14,
                        color: 'white'
                    }}
                    className="font-bold"
                >{appContext?.userDetails?.displayName || "Rahul Kumar"}</Text>
                <Text style={{ color: 'white', fontSize: 12 }}>{appContext?.userDetails?.role || "Employee | 10011"}</Text>
            </View>
        </View>

    </View>
}

export default Header