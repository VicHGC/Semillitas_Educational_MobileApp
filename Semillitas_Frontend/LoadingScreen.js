import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { styles } from './assets/css/LoadingScreen_Styles';

//reemplazar imagen después
const LoadingImage = require('./assets/LoadingScreenAssets/sem_running.gif'); // imagen de carga

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={LoadingImage} 
        style={styles.image} 
        resizeMode="contain"
      />
      <Text style={styles.loadingText}>Cargando...</Text>
    </View>
  );
};

export default LoadingScreen;