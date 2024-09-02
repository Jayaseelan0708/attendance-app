import React, { useContext, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import AppContext from '../../Store/AppContext';
import Home from '../Screens/Home/Home';
import { CSS } from '../../Assets/css/native_main_app';
import Main from '../Screens/Profile';

const MainStack = () => {
    const Stack = createNativeStackNavigator();
    const appContext = useContext(AppContext);

    return (<>
        <StatusBar backgroundColor={appContext?.statusBarInfo?.backgroundColor || CSS.COLOR.STATUS_BAR} />
        <Stack.Navigator>
            <Stack.Screen name='Home' component={Home} options={{ title: 'Home', headerShown: false }} />
            <Stack.Screen name="MainProfile" component={Main} options={{
                title: 'Profile', headerShown: true, headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: CSS.COLOR.THEME
                }
            }} />
        </Stack.Navigator>
    </>

    )
}

export default MainStack