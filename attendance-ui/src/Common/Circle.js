import { View, Text } from 'react-native'
import React from 'react'

const Circle = ({children, width= 50, height= 50, borderColor= '#ddd'}) => {
  return (
    <View
    style={{ justifyContent: 'center', alignItems: 'center', width, height, borderRadius: width/2, borderWidth: 1, borderColor }}
>
    {children}
</View>
  )
}

export default Circle