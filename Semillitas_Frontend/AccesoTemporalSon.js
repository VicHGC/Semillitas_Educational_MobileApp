import React, { useRef, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles, COLORS } from './assets/css/AccesoTemporalSon_Styles'; 
import SideMenu from './SideMenu';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import apiClient from './utils/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from './utils/logger';

import MenuIconLocal from './assets/FatherMainAssets/MenuIcon.png';
import SemillinIconLocal from './assets/FatherMainAssets/Semillin.png';

const AccesoTemporalSon = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const menuRef = useRef();
  const { childData } = route.params || {};
  const [metricsData, setMetricsData] = useState(null);
  const [difficultLetters, setDifficultLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChildModal, setShowChildModal] = useState(false);

  const displayData = metricsData || childData || {};
  const DEFAULT_AVATAR_URL = 'https://pub-b8d90bf906d3498aa934aae83a10a3d3.r2.dev/basicAvatar.PNG';
  const isValidUrl = displayData.avatar_url && displayData.avatar_url.startsWith('http');
  const childName = displayData.name || "Hijo";
  const avatarSource = isValidUrl ? { uri: displayData.avatar_url } : { uri: DEFAULT_AVATAR_URL };
  const childAge = displayData.age || 0;
  const childCoins = displayData.coins || 0;
  const mathProgress = displayData.metrics?.math_progress || 0;
  const spanishProgress = displayData.metrics?.spanish_progress || 0;
  const lastActivityName = displayData.lastActivity?.name || "Sin actividad reciente";
  const lastActivityScore = displayData.lastActivity?.score ? `${displayData.lastActivity.score} pts` : "";
  const lastActivityDate = displayData.lastActivity?.date ? new Date(displayData.lastActivity.date).toLocaleDateString() : "---";
  
  // Nuevas métricas de actividad
  const totalTimePlayed = displayData.total_time_played || 0;
  const currentStreak = displayData.current_streak || 0;
  const lastPlayedDate = displayData.last_played_date 
      ? new Date(displayData.last_played_date).toLocaleDateString() 
      : "Nunca";

  // USAMOS FOCUS EFFECT PARA RECARGAR AL VOLVER
  useFocusEffect(
    useCallback(() => {
        const fetchMetrics = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                if (!childData?.id || !token) return;

                // console.log(`📡 Actualizando métricas padre-hijo ID: ${childData.id}`);
                const response = await apiClient.get(
                    `/api/father/child-metrics/${childData.id}`
                );

                if (response.data.success) {
                    setMetricsData(response.data.data);
                }
                
                // Obtener letras difíciles
                const lettersResponse = await apiClient.get(
                    `/api/activities/difficult-letters/${childData.id}`
                );
                
                if (lettersResponse.data.success) {
                    setDifficultLetters(lettersResponse.data.data || []);
                }
            } catch (error) {
                logger.error('FETCH', 'Error fetching metrics', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, [childData])
  );

    const handleVisitSon = () => {
        setShowChildModal(true);
    };

  const handleDeleteSon = () => {
    Alert.alert("Eliminar Perfil", `¿Estás seguro que quieres eliminar a ${childName}?`, [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: async () => {
            try {
                setLoading(true);
                if (!childData?.id) return;
                await apiClient.delete(
                    `/api/father/delete-child/${childData.id}`
                );
                Alert.alert("Éxito", "Perfil eliminado correctamente.");
                navigation.goBack(); 
            } catch (error) {
                Alert.alert("Error", "No se pudo eliminar el perfil.");
                setLoading(false);
            }
          }
        }
      ]);
  };

  const handleGenerateQR = () => {
    navigation.navigate('GenerateQR', { childData: displayData });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => menuRef.current?.toggleMenu()} style={styles.iconWrapperLeft}>
          <Image source={MenuIconLocal} style={styles.menuIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Semillitas</Text>
        <View style={styles.iconWrapperRight}>
          <Image source={SemillinIconLocal} style={styles.semillinImage} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.content}>
        {loading && <ActivityIndicator size="small" color="#FFF" style={{marginBottom: 10}} />}
        <View style={[styles.baseCard, { backgroundColor: '#CE93D8', borderWidth: 1, borderColor: COLORS.BORDER_GRAY }]}>
            <View style={styles.avatarContainer}>
                <Image source={avatarSource} style={styles.avatarImageLarge} />
            </View>
            <Text style={styles.cardTitleWhite}>{childName}</Text>
            <TouchableOpacity style={styles.visitButton} onPress={handleVisitSon}>
                <Text style={styles.visitButtonText}> Jugar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                    style={[styles.visitButton, {backgroundColor: '#FFD700'}]} 
                    onPress={handleGenerateQR}
                >
                    <Text style={[styles.visitButtonText, {color: '#333'}]}> Vincular </Text>
                </TouchableOpacity>
        </View>

        <View style={[styles.baseCard, { backgroundColor: '#F48FB1', borderWidth: 1, borderColor: COLORS.BORDER_GRAY }]}>
            <Text style={styles.cardTitleWhite}>Progreso</Text>
            <View style={styles.chartRow}>
                <View style={{alignItems: 'center'}}>
                    <View style={styles.pieChartBig}>
                        <View style={[styles.pieSlice, { 
                            transform: [{ rotate: `${(mathProgress / 100) * 360}deg` }],
                            backgroundColor: mathProgress >= 100 ? '#80CBC4' : '#FFCC80'
                        }]} />
                        <View style={styles.chartCenter}>
                            <Text style={styles.chartPercent}>{mathProgress}%</Text>
                        </View>
                    </View>
                    <Text style={styles.chartLabel}>Matemáticas</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                    <View style={styles.pieChartBig}>
                        <View style={[styles.pieSlice, { 
                            transform: [{ rotate: `${(spanishProgress / 100) * 360}deg` }],
                            backgroundColor: spanishProgress >= 100 ? '#80CBC4' : '#FFCC80'
                        }]} />
                        <View style={styles.chartCenter}>
                            <Text style={styles.chartPercent}>{spanishProgress}%</Text>
                        </View>
                    </View>
                    <Text style={styles.chartLabel}>Español</Text>
                </View>
            </View>
        </View>

        {/* ESTADÍSTICAS UNIFICADAS */}
        <View style={[styles.baseCard, { backgroundColor: '#B2DFDB', marginTop: 15 }]}>
            <Text style={{fontSize:22, fontWeight:'bold', color:'#00695C', marginBottom:15, fontFamily:'NuevaFuente', textAlign:'center'}}>Estadísticas de {childName}</Text>
            
            {/* Primera fila: Nivel y Monedas */}
            <View style={{flexDirection:'row', justifyContent:'space-around', marginBottom:15}}>
                <View style={{alignItems:'center', backgroundColor:'#FFF9C4', padding:15, borderRadius:20, flex:1, marginRight:8, elevation:3}}>
                    <Text style={{fontSize:14, color:'#666', fontFamily:'NuevaFuente'}}>Nivel</Text>
                    <Text style={{fontSize:32, fontWeight:'bold', color:'#FF8F00'}}>{Math.floor((displayData.exp_points || 0) / 100) + 1}</Text>
                </View>
                <View style={{alignItems:'center', backgroundColor:'#FFF9C4', padding:15, borderRadius:20, flex:1, marginLeft:8, elevation:3}}>
                    <Text style={{fontSize:14, color:'#666', fontFamily:'NuevaFuente'}}>Monedas</Text>
                    <Text style={{fontSize:32, fontWeight:'bold', color:'#FF8F00'}}>{childCoins}</Text>
                </View>
            </View>

            {/* Segunda fila: Gráficos circulares de progreso */}
            {/* Gráfico de barras de actividad */}
            <View style={{backgroundColor:'#FFF', padding:15, borderRadius:20, marginBottom:15, elevation:2}}>
                <Text style={{fontSize:18, fontWeight:'bold', color:'#333', marginBottom:12, fontFamily:'NuevaFuente', textAlign:'center'}}>Actividad</Text>
                <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'flex-end', height:100}}>
                    {/* Tiempo jugado */}
                    <View style={{alignItems:'center'}}>
                        <View style={{width:60, height:Math.min(totalTimePlayed * 20, 80), backgroundColor:'#80CBC4', borderRadius:10, justifyContent:'center', alignItems:'center', elevation:2}}>
                            <Text style={{fontSize:16, fontWeight:'bold', color:'#FFF'}}>{totalTimePlayed}</Text>
                        </View>
                        <Text style={{fontSize:12, color:'#666', marginTop:5, fontFamily:'NuevaFuente'}}>min</Text>
                    </View>
                    {/* Racha */}
                    <View style={{alignItems:'center'}}>
                        <View style={{width:60, height:Math.min(currentStreak * 30, 80), backgroundColor:'#FFAB91', borderRadius:10, justifyContent:'center', alignItems:'center', elevation:2}}>
                            <Text style={{fontSize:16, fontWeight:'bold', color:'#FFF'}}>{currentStreak}</Text>
                        </View>
                        <Text style={{fontSize:12, color:'#666', marginTop:5, fontFamily:'NuevaFuente'}}>días</Text>
                    </View>

                </View>
            </View>

            {/* ÚLTIMA ACTIVIDAD */}
            {lastActivityName && lastActivityName !== "Sin actividad reciente" && (
                <View style={{backgroundColor:'#E1F5FE', padding:15, borderRadius:20, elevation:2}}>
                    <Text style={{fontSize:18, fontWeight:'bold', color:'#0277BD', marginBottom:8, fontFamily:'NuevaFuente'}}>Última Actividad</Text>
                    <Text style={{fontSize:20, fontWeight:'bold', color:'#333', fontFamily:'NuevaFuente'}}>{lastActivityName}</Text>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:8}}>
                        <Text style={{color:'#4CAF50', fontSize:16, fontWeight:'bold'}}>{lastActivityScore}</Text>
                        <Text style={{color:'#666', fontSize:14}}>{lastActivityDate}</Text>
                    </View>
                </View>
            )}
        </View>

        {/* GRÁFICO DE LETRAS DIFÍCILES */}
        {difficultLetters.length > 0 && (
            <View style={[styles.baseCard, { backgroundColor: '#FFE0B2', marginTop: 15 }]}>
                <Text style={{fontSize:20, fontWeight:'bold', color:'#E65100', marginBottom:15, fontFamily:'NuevaFuente', textAlign:'center'}}>Letras por Practicar</Text>
                
                {difficultLetters.map((letter, index) => {
                    const maxErrors = Math.max(...difficultLetters.map(l => l.errors));
                    const barWidth = (letter.errors / maxErrors) * 100;
                    const errorColor = letter.error_rate > 50 ? '#EF9A9A' : letter.error_rate > 30 ? '#FFCC80' : '#FFF59D';
                    
                    return (
                        <View key={index} style={{marginBottom:15, backgroundColor:'#FFF', padding:12, borderRadius:15, elevation:2}}>
                            <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:8}}>
                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <View style={{width:40, height:40, borderRadius:20, backgroundColor:'#FFF3E0', justifyContent:'center', alignItems:'center', marginRight:10, borderWidth:2, borderColor:'#FFB74D'}}>
                                        <Text style={{fontSize:22, fontWeight:'bold', color:'#E65100'}}>{letter.objective_letter}</Text>
                                    </View>
                                    <Text style={{fontSize:14, color:'#666', fontFamily:'NuevaFuente'}}>{letter.total_attempts} intentos</Text>
                                </View>
                                <View style={{alignItems:'flex-end'}}>
                                    <Text style={{fontSize:18, fontWeight:'bold', color: errorColor === '#EF9A9A' ? '#E53935' : errorColor === '#FFCC80' ? '#F57C00' : '#F9A825'}}>{letter.error_rate}%</Text>
                                </View>
                            </View>
                            {/* Barra de progreso */}
                            <View style={{height:16, backgroundColor:'#F5F5F5', borderRadius:8, overflow:'hidden'}}>
                                <View style={{width: `${barWidth}%`, height:'100%', backgroundColor: errorColor, borderRadius:8}} />
                            </View>
                            <Text style={{fontSize:12, color:'#999', marginTop:4}}>{letter.errors} fallos de {letter.total_attempts}</Text>
                        </View>
                    );
                })}
            </View>
        )}

        <View style={{ marginTop: 30, marginBottom: 50, alignItems: 'center' }}>
            <TouchableOpacity onPress={handleDeleteSon} style={{ backgroundColor: '#ff4444', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, elevation: 5 }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Eliminar Perfil</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      <SideMenu ref={menuRef} />
        
    {showChildModal && (
    <View style={localStyles.manualModalOverlay}>
            <View style={localStyles.modalContent}>
                
                {/* Título amigable */}
                <Text style={[localStyles.winTitle, { color: '#4CAF50' }]}>Modo Niño</Text>
                
                {/* Mensaje de confirmación con el nombre del hijo */}
                <Text style={[localStyles.winSubtitle, { textAlign: 'center', marginBottom: 25 }]}>
                    ¿Ingresar como {childName}?
                </Text>
                
                {/* Contenedor de botones en fila (lado a lado) */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    
                    {/* BOTÓN CANCELAR */}
                    <TouchableOpacity 
                        style={[localStyles.continueButton, { backgroundColor: '#9E9E9E', flex: 1, marginRight: 10, paddingHorizontal: 0, alignItems: 'center' }]} 
                        onPress={() => setShowChildModal(false)}
                    >
                        <Text style={localStyles.continueText}>Cancelar</Text>
                    </TouchableOpacity>

                    {/* BOTÓN INGRESAR */}
                    <TouchableOpacity 
                        style={[localStyles.continueButton, { backgroundColor: '#4CAF50', flex: 1, marginLeft: 10, paddingHorizontal: 0, alignItems: 'center' }]} 
                        onPress={() => {
                            setShowChildModal(false); // Cerramos el modal primero
                            navigation.navigate('SonMain', { childId: childData?.id, vieneDelPadre: true });
                        }}
                    >
                        <Text style={localStyles.continueText}>Ingresar</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
      )}
    </SafeAreaView>
  );
};

// 🌟 AGREGA ESTO AL FINAL DE TU ARCHIVO PARA CONTROLAR EL MODAL
const localStyles = StyleSheet.create({
    manualModalOverlay: {
        position: 'absolute', 
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)', 
        justifyContent: 'center', 
        alignItems: 'center',
        zIndex: 5000 
    },
    modalContent: {
        width: '85%', backgroundColor: 'white', borderRadius: 25, padding: 30, alignItems: 'center', elevation: 10
    },
    winTitle: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50', marginBottom: 10, textAlign: 'center' },
    winSubtitle: { fontSize: 18, color: '#555', marginBottom: 20 },
    continueButton: { paddingVertical: 14, borderRadius: 30, elevation: 5 },
    continueText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default AccesoTemporalSon;