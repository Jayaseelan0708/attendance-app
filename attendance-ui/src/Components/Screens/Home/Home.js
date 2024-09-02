import { View, Text, StyleSheet, StatusBar, Button, SafeAreaView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../Store/AppContext'
import Header from '../../Layout/Header/Header'
import Scanner from '../Scanner/Scanner';
import Employee from '../Employee/Employee';
import tw from 'twrnc';
import GlobalConstants from '../../../Constants/GlobalConstants';

const Home = ({ navigation }) => {
    const appContext = useContext(AppContext);

    return (
        <SafeAreaView style={tw`bg-white h-full`}>
            <View style={tw`h-full`}>
                <Header {...{ navigation }} />
                {
                    (appContext?.userDetails?.role === GlobalConstants.ROLE.SCANNER)
                        ? <Scanner />
                        : <Employee />
                }
            </View>
        </SafeAreaView>

    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#ecf0f1'
    }
});
