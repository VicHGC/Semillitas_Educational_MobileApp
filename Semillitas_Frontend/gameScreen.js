import React, { useState, useEffect, useRef } from 'react';
import LoadingScreen from './LoadingScreen'; 
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './assets/css/Template_Styles';
import { useRoute, useNavigation } from '@react-navigation/native';
import apiClient from './utils/apiClient'; 
import ConfettiCannon from 'react-native-confetti-cannon';

// Imports de los distintos motores de juegos
import VoiceGame from './Games/VoiceGame';
import DrawingGame from './Games/DrawingGame';
import QuizGame from './Games/QuizGame';

const SemillinIconLocal = require('./assets/FatherMainAssets/Semillin.png');
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const { width, height } = Dimensions.get('window'); 

export default function GameScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    
    // 1. Extraemos activityType para saber qué juego cargar (Caligrafía, Voz, etc.)
    const { activityId, childId, activityType } = route.params || {}; 
    const gameRef = useRef(null);

    const [activityData, setActivityData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    
    const [showConfetti, setShowConfetti] = useState(false);
    const [showWinModal, setShowWinModal] = useState(false); 
    const [rewards, setRewards] = useState({ coins: 0, xp: 0 }); 
    const arrowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const arrowAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(arrowAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(arrowAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        );
        arrowAnimation.start();
        return () => arrowAnimation.stop();
    }, [arrowAnim]);

    useEffect(() => {
        setIsMounted(true);
        
        const fetchActivityData = async () => {
            try {
                const idToFetch = activityId || 1;
                const response = await fetch(`${API_URL}/api/activities/${idToFetch}`);
                if (!response.ok) throw new Error('Error al conectar');
                const data = await response.json();
                setActivityData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivityData();
    }, [activityId]);

    const handleGameWon = async () => {
        console.log("🏆 Victoria!");
        // 1. Primero mostramos el modal
        setShowWinModal(true);
        // 2. Un poquito después lanzamos el confeti para asegurar que salga encima
        setTimeout(() => setShowConfetti(true), 300);

        try {
            const response = await apiClient.post(
                '/api/activities/progress',
                { childId, activityId, score: 100 }
            );

            if (response.data.success && response.data.rewards) {
                setRewards(response.data.rewards);
            }
        } catch (error) {
            console.error("❌ Error al guardar:", error);
        }
    };

    const handlePlayInstruction = () => {
        if (gameRef.current && gameRef.current.playInstruction) {
            gameRef.current.playInstruction();
        }
    };

    const handleContinue = () => {
        setShowWinModal(false);
        setShowConfetti(false); // Apagar confeti
        navigation.goBack(); 
    };

    // Calculamos el tipo de juego aquí arriba para poder usarlo en toda la vista
    const currentType = activityType || activityData?.type;

    // 2. El enrutador interno que decide qué vista de juego renderizar
    const renderGameComponent = () => {
        if (!activityData) return null;

        switch (currentType) {
            case 'voz': 
                return <VoiceGame ref={gameRef} activityData={activityData} onWin={handleGameWon} />;
            case 'caligrafia': 
                return (
                    <DrawingGame 
                        ref={gameRef} 
                        activityData={activityData} 
                        childId={childId}
                        // Vinculamos la victoria de la IA con tu modal y base de datos
                        onFinishGame={handleGameWon} 
                    />
                );
            case 'problema': 
                return <QuizGame ref={gameRef} activityData={activityData} onWin={handleGameWon} />;
            default: 
                return <View><Text style={{color: 'white'}}>Error: Tipo desconocido ({currentType})</Text></View>;
        }
    };

    if (!isMounted || isLoading) return <LoadingScreen />;
    if (error) return <SafeAreaView style={styles.container}><Text style={{color:'white'}}>Error: {error}</Text></SafeAreaView>;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {/* 🌟 BOTÓN REGRESAR ACTUALIZADO: Adiós emoji feo, hola icono PNG */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
                    <Image 
                        source={require('./assets/SelectTheGame/icon-regresar.png')} 
                        style={localStyles.backIconImage} 
                        resizeMode="contain" 
                    />
                </TouchableOpacity>
                
                <Text style={styles.headerText}>Semillitas</Text>
                <Image source={SemillinIconLocal} style={styles.semillinImage} />
            </View>
            
            <View style={styles.content}>
                {activityData && (
                    <View style={{ flex: 1 }}>
                        
                        {/* MOSTRAMOS instructionButton SOLO para voz (los demás juegos manejan su propia UI) */}
                        {currentType === 'voz' && (
                            <View style={localStyles.voiceContainer}>
                                <TouchableOpacity onPress={handlePlayInstruction} style={localStyles.instructionButton}>
                                    <Text style={[styles.headerText, localStyles.textShadow]}>
                                        {activityData.objectiveSentence || activityData.objectiveLetter || ''} 🔊
                                    </Text>
                                </TouchableOpacity>
                                <Animated.View style={{
                                    transform: [{ translateX: arrowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 15] }) }]
                                }}>
                                    <Text style={localStyles.arrowText}>👆 Presiona para iniciar</Text>
                                </Animated.View>
                            </View>
                        )}
                        
                        {/* Aquí es donde ocurre la magia de inyectar el juego correcto */}
                        {renderGameComponent()}
                    </View>
                )}
            </View>

            {/* MODAL MANUAL (VIEW ABSOLUTO) */}
            {showWinModal && (
                <View style={localStyles.manualModalOverlay}>
                    <View style={localStyles.modalContent}>
                        <Text style={localStyles.winTitle}>¡FELICIDADES! 🎉</Text>
                        <Text style={localStyles.winSubtitle}>¡Lo hiciste muy bien!</Text>
                        
                        <View style={localStyles.rewardsContainer}>
                            <View style={localStyles.rewardItem}>
                                <Text style={{fontSize:40}}>🪙</Text>
                                <Text style={localStyles.rewardText}>+{rewards.coins || 10}</Text>
                            </View>
                            <View style={localStyles.rewardItem}>
                                <Text style={{fontSize:40}}>⭐</Text>
                                <Text style={localStyles.rewardText}>+{rewards.xp || 20} XP</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={localStyles.continueButton} onPress={handleContinue}>
                            <Text style={localStyles.continueText}>CONTINUAR ➜</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* CONFETI: Se renderiza al final y tiene zIndex alto */}
            {showConfetti && (
                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999}} pointerEvents="none">
                    <ConfettiCannon 
                        count={200} 
                        origin={{x: -10, y: 0}} 
                        fadeOut={true}
                        fallSpeed={3000}
                    />
                </View>
            )}

        </SafeAreaView>
    );
}

const localStyles = StyleSheet.create({
    voiceContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    instructionButton: {
        alignSelf: 'center', 
        padding: 10, borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    arrowText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
    },
    textShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10
    },
    manualModalOverlay: {
        position: 'absolute', 
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)', 
        justifyContent: 'center', 
        alignItems: 'center',
        zIndex: 5000 
    },
    modalContent: {
        width: '80%', backgroundColor: 'white', borderRadius: 25, padding: 30, alignItems: 'center', elevation: 10
    },
    winTitle: { fontSize: 32, fontWeight: 'bold', color: '#FFD700', marginBottom: 10, textAlign: 'center' },
    winSubtitle: { fontSize: 18, color: '#555', marginBottom: 20 },
    rewardsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 30 },
    rewardItem: { alignItems: 'center' },
    rewardText: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 5 },
    continueButton: { backgroundColor: '#4CAF50', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, elevation: 5 },
    continueText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    backIconImage: {
        width: 50,        // Tamaño idéntico al de los otros menús para mantener consistencia
        height: 50,       // Proporción cuadrada perfecta
    }

});