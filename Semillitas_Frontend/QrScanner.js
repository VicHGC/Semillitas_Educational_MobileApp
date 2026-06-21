import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import apiClient from './utils/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const QrScannerScreen = () => {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Hook para permisos
  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true); // Bloquear escaneo múltiple

    // Confirmación visual rápida
    Alert.alert(
      'Vinculando...',
      '¿Conectar este dispositivo?',
      [
        { text: 'Cancelar', onPress: () => setScanned(false), style: 'cancel' },
        { text: 'Conectar', onPress: () => processLink(data) }
      ]
    );
  };

const processLink = async (tokenScanned) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/qr/link`, {
         qrToken: tokenScanned 
      });

      const { accessToken, sonData } = response.data;

      if (accessToken) {
        // --- AQUÍ ESTÁ LA MAGIA ---
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('userRole', 'CHILD');
        await AsyncStorage.setItem('userName', sonData.son_name);
        
        // ¡NUEVO!: Guardamos el ID del niño en memoria
        if (sonData.id) {
            await AsyncStorage.setItem('childId', sonData.id.toString());
        }
        
        if(sonData.avatar_url) await AsyncStorage.setItem('userAvatar', sonData.avatar_url);

        Alert.alert('¡Bienvenido!', `Hola ${sonData.son_name || 'pequeño'}`, [
          { 
            text: "Empezar", 
            onPress: () => {
                navigation.reset({
                    index: 0,
                    // ¡NUEVO!: Le pasamos el parámetro childId a la ruta
                    routes: [{ name: 'SonMain', params: { childId: sonData.id } }], 
                });
            }
          }
        ]);
      }
    } catch (error) {
      // ... tu código de catch se queda igual
      console.error(error);
      const msg = error.response?.data?.message || 'Código QR inválido o expirado';
      Alert.alert('Error', msg);
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  // --- Renderizado de UI (Permisos y Cámara) ---
  if (!permission) return <View style={styles.center}><ActivityIndicator /></View>;
  
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 20 }}>Se necesita acceso a la cámara</Text>
        <PaperButton mode="contained" onPress={requestPermission}>Dar Permiso</PaperButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {/* Capa Visual (Marco) */}
      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.instructions}>Escanea el código del dispositivo padre</Text>
      </View>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={{ color: 'white', marginTop: 10 }}>Conectando con Semillitas...</Text>
        </View>
      )}
      
      {/* Botón Salir */}
      <PaperButton 
        mode="contained" 
        onPress={() => navigation.goBack()} 
        style={styles.closeBtn}
        buttonColor="rgba(255, 105, 180, 0.9)"
      >
        Cancelar
      </PaperButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 250, height: 250, borderWidth: 2, borderColor: '#FFF', borderRadius: 20 },
  instructions: { color: 'white', marginTop: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 5 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  closeBtn: { position: 'absolute', bottom: 40, alignSelf: 'center', paddingHorizontal: 20 }
});

export default QrScannerScreen;