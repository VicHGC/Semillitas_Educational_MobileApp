import React, { useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './assets/css/SonMain_Styles';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import apiClient from './utils/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SemillinIconLocal from './assets/LogInAssets/Semillin.png';
import shop from './assets/SonMainAssets/store.png';
import FloatingElements from './FloatingElements';

const SonMain = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Animaciones para los botones de materias
  const mathScaleAnim = useRef(new Animated.Value(1)).current;
  const spanishScaleAnim = useRef(new Animated.Value(1)).current;
  
  // EXTRAEMOS LA BANDERA 'vieneDelPadre' DE LOS PARÁMETROS
  const { childId, vieneDelPadre, updatedAvatarUrl } = route.params || {};

  const [stats, setStats] = useState({
    coins: 0, level: 1, levelProgress: 0, name: '', activeModules: [] 
  });
  const [loading, setLoading] = useState(true);
  const [activeChildId, setActiveChildId] = useState(childId); 
  const [showCoinTooltip, setShowCoinTooltip] = useState(false); 

  // USAMOS FOCUS EFFECT PARA RECARGAR AL VOLVER
  useFocusEffect(
    useCallback(() => {
        const fetchSonData = async () => {
            try {
                setLoading(true);
                const token = await AsyncStorage.getItem('accessToken');
                
                let currentChildId = childId;
                if (!currentChildId) {
                    currentChildId = await AsyncStorage.getItem('childId');
                }

                if (currentChildId && currentChildId !== activeChildId) {
                    setActiveChildId(currentChildId);
                }

                if (!currentChildId || !token) {
                    setLoading(false);
                    return;
                }

                const response = await apiClient.get(
                    `/api/son-home/info/${currentChildId}`
                );

                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("❌ Error cargando SonMain:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSonData();
    }, [childId])
  );

  // FUNCIÓN INTELIGENTE DE SALIDA
  const handleExit = () => {
    if (vieneDelPadre) {
      // Si entró el papá desde la app principal, solo lo regresamos a la vista anterior
      navigation.goBack();
    } else {
      // Si es el niño (por QR o inicio directo), le preguntamos si quiere cerrar sesión
      Alert.alert(
        "Salir del Juego",
        "¿Quieres salir y cerrar tu sesión?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Sí, salir", 
            style: "destructive",
            onPress: async () => {
              await AsyncStorage.removeItem('accessToken');
              await AsyncStorage.removeItem('childId');
              await AsyncStorage.removeItem('userInfo');
              await AsyncStorage.removeItem('userID');
              await AsyncStorage.removeItem('userEmail');
              
              navigation.reset({
                index: 0,
                routes: [{ name: 'LogIn' }],
              });
            } 
          }
        ]
      );
    }
  };

return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        
        {/* BOTÓN DINÁMICO ACTUALIZADO: Ahora usa imagen en lugar de emojis */}
        <TouchableOpacity onPress={handleExit} style={styles.iconWrapperLeft}>
          {/* 🌟 NUEVO: Cargamos la imagen icon-regresar */}
          <Image 
            source={require('./assets/SelectTheGame/icon-regresar.png')} 
            style={styles.backIconImage} // Le aplicamos el nuevo estilo
            resizeMode="contain" // Asegura que no se deforme
          />
        </TouchableOpacity>
        
        <Text style={styles.headerText}>Semillitas</Text>
        <View style={styles.iconWrapperRight}>
          <Image source={SemillinIconLocal} style={styles.semillinImage} />
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ flexGrow: 1 }}>
        {loading ? (
             <ActivityIndicator size="large" color="#FFF" style={{marginTop: 20}} />
        ) : (
        <>
            <View style={styles.topBar}>
                <View style={styles.statsContainer}>
                    <TouchableOpacity 
                        style={styles.coinContainer}
                        onPress={() => setShowCoinTooltip(!showCoinTooltip)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.coinEmoji}>🪙</Text>
                        <Text style={styles.coinText}>{stats.coins}</Text>
                        {showCoinTooltip && (
                            <View style={styles.coinTooltip}>
                                <Text style={styles.coinTooltipText}>Realiza actividades para ganar más monedas 🪙</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <View style={styles.xpBarContainer}>
                        <View style={styles.xpLabelRow}>
                            <Text style={styles.xpIcon}>⭐</Text>
                            <Text style={styles.xpText}>Nivel {stats.level}</Text>
                        </View>
                        <View style={styles.xpBarBackground}>
                            <View style={[styles.xpBarFill, { width: `${Math.min(stats.levelProgress, 100)}%` }]} />
                        </View>
                        <Text style={stats.levelProgress >= 100 ? styles.xpPercentComplete : styles.xpPercent}>{stats.levelProgress}%</Text>
                    </View>
                </View>
                <TouchableOpacity 
                    style={styles.shopButton}
                    onPress={() => navigation.navigate('Shop', { childId: activeChildId, coins: stats.coins, currentAvatarUrl: stats.avatar_url })}
                >
                    <Image source={shop} style={styles.shopButtonImage} resizeMode="contain" />
                </TouchableOpacity>
            </View>

            {/* Avatar del niño */}
            {stats.avatar_url && (
                <View style={styles.avatarContainer}>
                    <Image 
                        source={{ uri: stats.avatar_url }} 
                        style={styles.avatarImage} 
                        resizeMode="cover"
                    />
                </View>
            )}

<View style={styles.subjectsContainer}>
            {/* Lógica segura para tildes */}
            {stats.activeModules && (stats.activeModules.includes('Matemáticas') || stats.activeModules.includes('Matematicas')) && (
                <Animated.View style={{ transform: [{ scale: mathScaleAnim }], width: '100%' }}>
                    <TouchableOpacity 
                        style={[styles.subjectButton, styles.mathButton]}
                        onPress={() => navigation.navigate('ActivityScreen', { moduleName: 'Matemáticas', childId: activeChildId })}
                        onPressIn={() => {
                            Animated.spring(mathScaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
                        }}
                        onPressOut={() => {
                            Animated.spring(mathScaleAnim, { toValue: 1, useNativeDriver: true }).start();
                        }}
                    >
                        {/* 🌟 COMBINADO: Tu imagen PNG profesional dentro del botón animado del equipo */}
                        <Image 
                            source={require('./assets/SelectTheGame/Semillitas_Matematicas.png')} 
                            style={styles.subjectImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.subjectTitle}>Matemáticas</Text>
                        <Text style={styles.subjectSubtitle}>Practica operaciones</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {stats.activeModules && (stats.activeModules.includes('Español') || stats.activeModules.includes('Espanol')) && (
                <Animated.View style={{ transform: [{ scale: spanishScaleAnim }], width: '100%' }}>
                    <TouchableOpacity 
                        style={[styles.subjectButton, styles.spanishButton]}
                        onPress={() => navigation.navigate('ActivityScreen', { moduleName: 'Español', childId: activeChildId })}
                        onPressIn={() => {
                            Animated.spring(spanishScaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
                        }}
                        onPressOut={() => {
                            Animated.spring(spanishScaleAnim, { toValue: 1, useNativeDriver: true }).start();
                        }}
                    >
                        {/* 🌟 COMBINADO: Tu imagen PNG profesional dentro del botón animado del equipo */}
                        <Image 
                            source={require('./assets/SelectTheGame/Semillitas_Espaniol.png')} 
                            style={styles.subjectImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.subjectTitle}>Español</Text>
                        <Text style={styles.subjectSubtitle}>Aprende lenguaje</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
            
            {stats.activeModules && stats.activeModules.length === 0 && (
                <Text style={{color: 'white', textAlign: 'center'}}>No tienes materias asignadas aún.</Text>
            )}
            </View>

            <Text style={styles.infoText}>Selecciona una materia para comenzar</Text>
        </>
        )}
      </ScrollView>

      {/* Elementos flotantes decorativos */}
      <FloatingElements />
    </SafeAreaView>
  );
};

export default SonMain;