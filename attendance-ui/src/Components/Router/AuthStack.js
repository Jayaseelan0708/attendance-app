import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Screens/Auth/Login';
import InputOTPScreen from '../Screens/Auth/InputOTPScreen';
import LoginHome from '../Screens/Auth/LoginHome';


const AuthStack = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
            <Stack.Screen name="LoginHome" component={LoginHome}></Stack.Screen>
            <Stack.Screen name="Login" component={Login}></Stack.Screen>
            <Stack.Screen name="InputOTPScreen" component={InputOTPScreen}></Stack.Screen>
        </Stack.Navigator>
    )
}

export default AuthStack