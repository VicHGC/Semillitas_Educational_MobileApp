import React, { useState, useEffect } from 'react'; 
import { View, Text, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput as PaperInput, Button as PaperButton } from 'react-native-paper'; 
import { styles } from './assets/css/LogIn_Styles';
import SemillinImage from './assets/LogInAssets/Semillin.png'; 
import { useNavigation } from '@react-navigation/native'; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// CAMBIO 1: Importamos la librería Nativa
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

//Rutas: 

const BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const API_URL_LOGIN = `${BACKEND_BASE_URL}/crear/loginUsuarioEmail`; //Login de un usuario existente
const REGISTER_URL = `${BACKEND_BASE_URL}/crear/nuevoUsuario/`; // crear nuevo usuario
const GOOGLE_MOBILE_AUTH_URL = `${BACKEND_BASE_URL}/api/auth/google/mobile`; //crear o registrar un nuevo usuario con Google

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const navigation = useNavigation();

  // CAMBIO 2: Configuración Inicial (Solo se ejecuta una vez)
  useEffect(() => {
    GoogleSignin.configure({
      // Usamos el WEB CLIENT ID aquí. 
      // ¿Por qué? Porque queremos que Google nos devuelva un código que tu Backend (Node.js) pueda entender.
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
      
      // Esto le dice a Google que queremos un 'code' para usarlo en el servidor
      offlineAccess: true, 
      
      // Forzamos la elección de cuenta
      forceCodeForRefreshToken: true,
    });
  }, []);

  // CAMBIO 3: Función de Login Nativa
const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      // Limpiar sesión previa para forzar selección de cuenta
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn({
        prompt: 'select_account',
      });
      console.log('👤 Usuario:', userInfo);

      // CORRECCIÓN AQUÍ:
      // La librería devolvió el código dentro de 'data'.
      // Usamos el operador '?.' para evitar errores si 'data' no existe.
      const code = userInfo.serverAuthCode || userInfo.data?.serverAuthCode; 
      
      if (!code) {
        throw new Error('No se recibió el código de servidor (serverAuthCode)');
      }

      console.log('🔐 Código obtenido:', code);

      console.log('📤 Enviando al backend...');
      const backendResponse = await axios.post(GOOGLE_MOBILE_AUTH_URL, {
        code: code,
        redirectUri: '' // Dejar vacío para flujo nativo
      });

      console.log('✅ Respuesta Backend:', backendResponse.data);

      if (backendResponse.data && backendResponse.data.accessToken) {
        const { accessToken, refreshToken, userID } = backendResponse.data;
        await AsyncStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          await AsyncStorage.setItem('refreshToken', refreshToken);
        }
        await AsyncStorage.setItem('userID', userID.toString());

        const userDataToSave = userInfo.data?.user || userInfo.user; 
        if (userDataToSave) {
          await AsyncStorage.setItem('userInfo', JSON.stringify(userDataToSave));
        }

        navigation.navigate('DoneScreen');
      }

    } catch (error) {
      console.error('❌ Error Google:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Cancelado por usuario');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('En progreso');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services no está actualizado');
      } else {
        Alert.alert('Error', error.message || 'Error al iniciar sesión');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // --- MÉTODOS DE LOGIN Y REGISTRO NORMAL (Sin cambios importantes) ---

  const sendLogIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
      return;
    }
    setIsLoading(true);
    setIsLoginLoading(true);
    try {
      const userData = { email, password };
      const response = await axios.post(API_URL_LOGIN, userData, {
        headers: { 'Content-Type': 'application/json' },
      });
      const { accessToken, userID } = response.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('userID', userID.toString());
      await AsyncStorage.setItem('userEmail', email);
      navigation.navigate('DoneScreen');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data || 'Error en el servidor';
        switch (status) {
          case 400: Alert.alert('Error', 'Email y contraseña son requeridos'); break;
          case 401: Alert.alert('Error', 'Email o contraseña incorrectos'); break;
          case 500: Alert.alert('Error', 'Error interno del servidor'); break;
          default: Alert.alert('Error', typeof errorMessage === 'string' ? errorMessage : 'Error desconocido');
        }
      } else {
        Alert.alert('Error de Conexión', 'No se pudo conectar al servidor.');
      }
    } finally {
      setIsLoading(false);
      setIsLoginLoading(false);
    }
  };

  const sendRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setIsLoading(true);
    setIsRegisterLoading(true);
    try {
      const userData = { email, password };
      const response = await axios.post(REGISTER_URL, userData, {
        headers: { 'Content-Type': 'application/json' },
      });
      // Opcional: Limpiar campos
      setEmail('');
      setPassword('');
      if (response.data.accessToken) {
        await AsyncStorage.setItem('accessToken', response.data.accessToken);
        if (response.data.userID) {
          await AsyncStorage.setItem('userID', response.data.userID.toString());
        }
        navigation.navigate('DoneScreen');
      } 
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.message || error.response.data;
        switch (status) {
          case 400: Alert.alert('Error', 'Datos inválidos o faltantes'); break;
          case 409: Alert.alert('Error', 'Este correo ya está registrado'); break;
          case 500: Alert.alert('Error', 'Error interno del servidor'); break;
          default: Alert.alert('Error', typeof errorMessage === 'string' ? errorMessage : 'Error en el registro');
        }
      } else {
        Alert.alert('Error de Conexión', 'No se pudo conectar al servidor');
      }
    } finally {
      setIsLoading(false);
      setIsRegisterLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.fullScreen}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Semillitas</Text>
        <Image source={SemillinImage} style={styles.logo} resizeMode="contain" />
        <Text style={styles.textoCreaCuenta}>Crea una cuenta</Text>
        <Text style={styles.textoIngresa}>Ingresa tu correo Electrónico</Text>
        <Text style={[styles.textoIngresa, { marginBottom: 10 }]}>
          para registrarte en esta aplicación
        </Text>        

        <PaperInput
          label="Correo Electrónico"
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.inputPaper}
          value={email}
          onChangeText={setEmail}
          disabled={isLoading}
        />

        <PaperInput
          label="Contraseña"
          mode="outlined"
          secureTextEntry
          style={styles.inputPaper}
          value={password}
          onChangeText={setPassword}
          disabled={isLoading}
        />

        <PaperButton 
          mode="contained"
          style={styles.LogInButton}
          labelStyle={styles.loginButtonText}
          onPress={sendLogIn}
          disabled={isLoading}
          loading={isLoginLoading}
        >
          Iniciar Sesión
        </PaperButton>

        <PaperButton 
          mode="contained"
          style={styles.LogInButton}
          labelStyle={styles.loginButtonText}
          onPress={sendRegister}
          disabled={isLoading}
          loading={isRegisterLoading}
        >
          Registrate
        </PaperButton>

        <PaperButton 
          mode="text" 
          style={styles.QrButton}
          labelStyle={styles.QrButtonText}
          onPress={() => navigation.navigate('QrScanner')}
          disabled={isLoading}
        >
          Escanear Código QR
        </PaperButton>

        {/* BOTÓN GOOGLE */}
        <PaperButton 
          mode="text" 
          icon="google"
          style={styles.GoogleSignButton}
          labelStyle={styles.GoogleSignText}
          disabled={isLoading || isGoogleLoading}
          onPress={handleGoogleLogin}
          loading={isGoogleLoading}
        >
          {isGoogleLoading ? 'Conectando...' : 'Continuar con Google'}
        </PaperButton>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LogIn;