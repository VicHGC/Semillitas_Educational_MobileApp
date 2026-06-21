import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from './utils/apiClient';

const GenerateQR = ({ route, navigation }) => {
  // Recibimos los datos del niño desde la pantalla anterior
  const { childData } = route.params;
  
  const [qrToken, setQrToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generamos el token apenas se abre la pantalla
  useEffect(() => {
    generateToken();
  }, []);

  const generateToken = async () => {
    try {
      setLoading(true);
      console.log("🔄 Solicitando token QR al backend...");
      
      const response = await apiClient.post('/api/qr/generate', {
        sonId: childData.id 
      });

      if (response.data.success) {
        console.log("✅ Token recibido:", response.data.qrToken);
        setQrToken(response.data.qrToken);
      } else {
        Alert.alert("Error", "El servidor no devolvió un token válido.");
      }
    } catch (error) {
      console.error("❌ Error generando token:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor para generar el código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Vincular Dispositivo</Text>
        <Text style={styles.subtitle}>
          Escanea este código con el dispositivo de {childData.name || 'tu hijo'}
        </Text>
        
        <View style={styles.qrWrapper}>
          {loading ? (
            <View style={{ height: 200, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#6A5ACD" />
                <Text style={{ marginTop: 10, color: '#6A5ACD' }}>Generando código...</Text>
            </View>
          ) : qrToken ? (
            <QRCode
              value={qrToken}
              size={200}
              color="#6A5ACD"
              backgroundColor="white"
              // logo={require('./assets/tu_logo.png')} // Opcional: si quieres poner un logo en medio
              // logoSize={30}
            />
          ) : (
             <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{color: 'red', textAlign: 'center'}}>
                    No se pudo cargar el código.{'\n'}Revisa tu conexión.
                </Text>
                <TouchableOpacity onPress={generateToken} style={{ marginTop: 10 }}>
                    <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Reintentar</Text>
                </TouchableOpacity>
             </View>
          )}
        </View>

        <Text style={styles.infoText}>Este código expira en 10 minutos</Text>

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6A5ACD', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: 'white', padding: 30, borderRadius: 25, alignItems: 'center', width: '85%', elevation: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 20 },
  qrWrapper: { 
    padding: 20, 
    borderWidth: 2, 
    borderColor: '#eee', 
    borderRadius: 15, 
    alignItems: 'center', 
    justifyContent: 'center',
    minHeight: 240, // Altura fija para evitar saltos visuales
    minWidth: 240
  },
  infoText: { marginTop: 15, fontSize: 12, color: '#999' },
  backButton: { marginTop: 30, backgroundColor: '#FF69B4', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  backButtonText: { color: 'white', fontWeight: 'bold' }
});

export default GenerateQR;