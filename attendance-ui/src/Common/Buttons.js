import { Text, TouchableOpacity } from "react-native"
import { CSS } from "../Assets/css/native_main_app"

export const Button = ({
    children,
    onPress = () => { },
    bgColor = "",
    textColor = '',
    borderColor = '',
    label = "Press Here",
    title = "Press Here",
    style = {}
}) =>
    <TouchableOpacity
        onPress={onPress}
        style={{
            flex: 1,
            alignItems: "center",
            backgroundColor: bgColor || CSS.COLOR.THEME,
            paddingVertical: 10,
            paddingHorizontal: 50,
            borderWidth: 1,
            borderColor: borderColor || CSS.COLOR.THEME,
            borderRadius: 6,
            width: 250,
            ...style,
        }}
    >
        <Text style={{ color: textColor || '#000' }}>{children || label || title}</Text>
    </TouchableOpacity>