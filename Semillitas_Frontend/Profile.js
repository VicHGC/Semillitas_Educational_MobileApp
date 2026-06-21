import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SemillinIconLocal = require('./assets/FatherMainAssets/Semillin.png');
const UserIconLocal = require('./assets/FatherMainAssets/User.png');

export default function Profile() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        
        if (userInfoString) {
          setUserData(JSON.parse(userInfoString));
        } else {
          setUserData({
            name: "Usuario Semillitas",
            email: "Correo no disponible",
            photo: null
          });
        }
      } catch (error) {
        console.error("❌ Error al cargar los datos del perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('userInfo');
            await AsyncStorage.removeItem('userID');
            navigation.reset({
              index: 0,
              routes: [{ name: 'LogIn' }],
            });
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
    <View style={styles.header}>
        {/* 🌟 BOTÓN REGRESAR ACTUALIZADO EN MI PERFIL */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image 
                source={require('./assets/SelectTheGame/icon-regresar.png')} 
                style={styles.backIconImage} 
                resizeMode="contain" 
            />
        </TouchableOpacity>
        
        <Text style={styles.headerText}>Mi Perfil</Text>
        <Image source={SemillinIconLocal} style={styles.semillinImage} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#00BFA5" style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.profileCard}>
            
            <View style={styles.avatarContainer}>
              {/* Leemos la foto de Google (photo) o ponemos la genérica */}
              <Image 
                source={userData?.photo ? { uri: userData.photo } : (userData?.picture ? { uri: userData.picture } : UserIconLocal)} 
                style={styles.avatarImage} 
              />
            </View>

            {/* Leemos el nombre y correo */}
            <Text style={styles.userName}>{userData?.name || userData?.givenName || "Papá Semillitas"}</Text>
            <Text style={styles.userEmail}>{userData?.email}</Text>

            <View style={styles.divider} />

            {/* BOTÓN DE CERRAR SESIÓN */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#13B8A6', paddingVertical: 15, paddingHorizontal: 20,
    borderBottomWidth: 3, borderBottomColor: '#0E9384',
  },
  backButton: { padding: 5 },
  backButtonText: { fontSize: 24 },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  semillinImage: { width: 40, height: 40, resizeMode: 'contain' },
  content: { padding: 20, alignItems: 'center' },
  profileCard: {
    backgroundColor: '#FFFFFF', width: '100%', borderRadius: 20, padding: 30,
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, marginTop: 20,
  },
  avatarContainer: {
    width: 140, height: 140, borderRadius: 70, backgroundColor: '#E0F2F1',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    borderWidth: 4, borderColor: '#13B8A6', overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  userName: { fontSize: 26, fontWeight: 'bold', color: '#333333', marginBottom: 5, textAlign: 'center' },
  userEmail: { fontSize: 16, color: '#666666', marginBottom: 30 },
  divider: { height: 1, backgroundColor: '#EEEEEE', width: '100%', marginBottom: 30 },
  logoutButton: {
    backgroundColor: '#FFEBEE', paddingVertical: 15, width: '100%',
    borderRadius: 30, alignItems: 'center', borderWidth: 1, borderColor: '#FFCDD2',
  },
  logoutButtonText: { color: '#E53935', fontSize: 18, fontWeight: 'bold' },
  backIconImage: {
        width: 28,        // Consistencia total con el resto de la app
        height: 28,       // Proporción cuadrada
    }
});