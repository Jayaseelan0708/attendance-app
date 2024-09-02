import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import AppContext from '../../Store/AppContext';



export const Cards = ({ children, onPress= () => {}, style = {} }) => {
    const appContext = useContext(AppContext);
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                ...style,
            }}
        >
            <View style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                width: appContext.layoutInfo.width - 20,
                paddingHorizontal: 10,
                paddingVertical: 5,
                marginVertical: 10,
                marginHorizontal: 5,
                backgroundColor: '#fff'

            }}>
                {children}
            </View>
        </TouchableOpacity>

    )
}

export default Cards