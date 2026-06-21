import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, TouchableWithoutFeedback, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SideMenu = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current; // Inicia oculto fuera de la pantalla
  const navigation = useNavigation();

  // Exponemos la función toggleMenu a los componentes que usan este menú (FatherMain, CreateSon, etc.)
  useImperativeHandle(ref, () => ({
    toggleMenu: () => {
      if (isOpen) closeMenu();
      else openMenu();
    }
  }));

  const openMenu = () => {
    setIsOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
  };

  // --- LÓGICA DE LAS OPCIONES ---

  const handleAddSon = () => {
    closeMenu();
    navigation.navigate('CreateSon');
  };

  const handleProfile = () => {
    closeMenu();
    // OJO: Asegúrate de tener una vista llamada 'Profile' en tu Navigation, 
    // de lo contrario te dará error. Si aún no la tienes, coméntala temporalmente.
    navigation.navigate('Profile'); 
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas salir de Semillitas?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive",
          onPress: async () => {
            try {
              // 1. Destruimos el token para cerrar la puerta por seguridad
              await AsyncStorage.removeItem('accessToken');
              
              closeMenu();
              
              // 2. Reseteamos la navegación (para que el papá no pueda regresar picando "Back")
              navigation.reset({
                index: 0,
                routes: [{ name: 'LogIn' }], // Cambia 'LogIn' si tu pantalla de inicio de sesión se llama diferente
              });
            } catch (error) {
              console.error("Error al cerrar sesión:", error);
            }
          } 
        }
      ]
    );
  };

  // Si no está abierto, devolvemos null para que no interfiera con los toques en la pantalla
  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      {/* Fondo oscuro semitransparente. Si tocas fuera del menú, se cierra */}
      <TouchableWithoutFeedback onPress={closeMenu}>
        <View style={styles.backgroundDimmer} />
      </TouchableWithoutFeedback>

      {/* El panel blanco animado que entra desde la izquierda */}
      <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Menú</Text>
        </View>

        <View style={styles.menuItemsContainer}>
          
          {/* Opción 1: Agregar Nuevo Hijo */}
          <TouchableOpacity style={styles.menuItem} onPress={handleAddSon} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>🌱</Text>
            <Text style={styles.menuText}>Agregar Nuevo Hijo</Text>
          </TouchableOpacity>

          {/* Opción 2: Mi Perfil */}
          <TouchableOpacity style={styles.menuItem} onPress={handleProfile} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>👤</Text>
            <Text style={styles.menuText}>Mi Perfil</Text>
          </TouchableOpacity>

        </View>

        {/* Opción 3: Cerrar Sesión (Se pega al final de la pantalla) */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.logoutIcon}></Text>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999, // Super importante para que sobreescriba todo
    flexDirection: 'row',
  },
  backgroundDimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    width: width * 0.75, // El menú ocupa el 75% del ancho del celular
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingTop: 60, // Espaciado para que no choque con el reloj del celular
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 15,
    justifyContent: 'space-between', // Avienta "Cerrar Sesión" hasta el fondo
  },
  header: {
    paddingHorizontal: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00BFA5', // Un tono turquesa moderno
  },
  menuItemsContainer: {
    flex: 1,
    paddingTop: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 25,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuText: {
    fontSize: 18,
    color: '#444444',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 25,
    backgroundColor: '#FFF5F5', // Un fondo rojito muy claro para denotar cuidado
    borderTopWidth: 1,
    borderTopColor: '#FFD6D6',
  },
  logoutIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  logoutText: {
    fontSize: 18,
    color: '#E53935', // Texto rojo estilo advertencia
    fontWeight: 'bold',
  }
});

export default SideMenu;