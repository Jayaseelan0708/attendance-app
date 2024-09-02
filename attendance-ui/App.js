import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/Store/AppContext';
import Router from './src/Components/Router/Router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
const Stack = createNativeStackNavigator();

export default function App() {
    const isLoggedIn = false;
    return <AppProvider>
        <NavigationContainer>
            <SafeAreaProvider>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? "padding" : "height"}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? -64 : 0}
                >
                    <Router />
                </KeyboardAvoidingView>
            </SafeAreaProvider>
        </NavigationContainer>
    </AppProvider>;
}
