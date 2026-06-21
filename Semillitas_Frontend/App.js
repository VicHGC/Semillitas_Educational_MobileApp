// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';

// 🔹 Importa tus pantallas
import LogIn from './LogIn';
import FatherMain from './FatherMain';
import CreateSon from './CreateSon';
import QrScanner from './QrScanner';
import SonMain from './SonMain';
import DoneScreen from './DoneScreen';
import LoadingScreen from './LoadingScreen';
import GenerateQR from './GenerateQR';
import Profile from './Profile';
import Shop from './Shop';

// CORRECCIÓN 1: Mayúscula en el nombre del archivo 'ActivityScreen'
import ActivityScreen from './activityScreen'; 

import AccesoTemporalSon from './AccesoTemporalSon';

// Respeto tu decisión: importas el archivo con minúscula 'gameScreen'
import GameScreen from './gameScreen';


const Stack = createNativeStackNavigator();

export default function App() {

    const [fontsLoaded] = useFonts({
        'NuevaFuente': require('./assets/fonts/Kids Bus.otf')
    });

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LogIn" screenOptions={{ headerShown: false }}>

                <Stack.Screen 
                    name="LogIn" 
                    component={LogIn} 
                />

                <Stack.Screen 
                    name="QrScanner" 
                    component={QrScanner}
                    options={{ title: 'Escanear QR' }}
                />

                <Stack.Screen 
                    name="FatherMain" 
                    component={FatherMain} 
                />

                <Stack.Screen 
                    name="CreateSon" 
                    component={CreateSon} 
                />

                <Stack.Screen 
                    name="SonMain" 
                    component={SonMain} 
                />
                
                <Stack.Screen 
                    name="DoneScreen" 
                    component={DoneScreen} 
                />
                
                <Stack.Screen 
                    name="LoadingScreen" 
                    component={LoadingScreen} 
                />
                
                <Stack.Screen 
                    name="ActivityScreen" 
                    component={ActivityScreen} 
                />

                {/* CORRECCIÓN 2: El 'name' debe ser 'GameScreen' (Mayúscula) para que coincida con navigation.navigate */}
                <Stack.Screen
                    name="gameScreen"
                    component={GameScreen}
                />
                    
                <Stack.Screen 
                    name="AccesoTemporalSon" 
                    component={AccesoTemporalSon} 
                />

                <Stack.Screen
                    name="GenerateQR"
                    component={GenerateQR}
                />
                <Stack.Screen
                    name="Profile"
                    component={Profile}
                />
                <Stack.Screen
                    name="Shop"
                    component={Shop}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
