import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Asumo que los estilos están en esta ruta, ajústala si es necesario
import { styles } from './assets/css/DoneScreen_Syles';
// --- (Nuevas importaciones) ---
// import axios from 'axios'; // Descomenta si usas axios
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Descomenta si necesitas el token

//reemplazar imagen después
const LoadingImage = require('./assets/DoneScreenAssets/sem_cel.gif');

// Esta es una función de EJEMPLO. Aquí pondrías tus llamadas reales a la API.
const loadFatherMainData = async () => {
  // const token = await AsyncStorage.getItem('accessToken');
  // const config = { headers: { Authorization: `Bearer ${token}` } };
  
  // const profile = await axios.get('.../profile', config);
  // const semillitas = await axios.get('.../semillitas', config);

  // Simulamos una carga de datos que tarda 1.5 segundos
  await new Promise(resolve => setTimeout(resolve, 1500)); 
  
  console.log("Datos de FatherMain cargados");
  
  // return { profile: profile.data, semillitas: semillitas.data };
  return { success: true }; // Devuelve los datos
};


const WelcomeScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const loadDataAndNavigate = async () => {
      try {
        // Tarea 1: La promesa de carga de datos
        const dataPromise = loadFatherMainData();

        // Tarea 2: La promesa del tiempo mínimo (3 segundos)
        const minimumWaitPromise = new Promise(resolve => setTimeout(resolve, 3000));

        // Esperar a que AMBAS tareas terminen (se ejecutan en paralelo)
        const [dataResult] = await Promise.all([
          dataPromise,
          minimumWaitPromise
        ]);

        // Ambas tareas completadas. Navegar a FatherMain.
        // Puedes pasar los datos cargados como parámetros si es necesario
        // navigation.replace('FatherMain', { profile: dataResult.profile, ... });
        navigation.replace('FatherMain');

      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
        // Si falla la carga, mandamos al usuario de vuelta al Login
        Alert.alert('Error', 'No se pudieron cargar tus datos. Por favor, inicia sesión de nuevo.');
        navigation.replace('LogIn'); 
      }
    };

    loadDataAndNavigate();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image 
        source={LoadingImage} 
        style={styles.image} 
        resizeMode="contain"
      />
      <Text style={styles.loadingText}>Bienvenido</Text>
    </View>
  );
};

export default WelcomeScreen;