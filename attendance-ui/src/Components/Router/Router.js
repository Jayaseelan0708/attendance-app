import React from 'react'
import { useContext } from 'react';
import AppContext from '../../Store/AppContext';
import MainStack from './MainStack';
import AuthStack from './AuthStack';
const Router = () => {
    const appContext = useContext(AppContext);

    return <>
        {
            appContext?.userDetails?.sid
                ? <MainStack />
                : <AuthStack />
        }
        {/* <MainStack /> */}
    </>
}

export default Router