import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import axios from 'axios';
import { Audio } from 'expo-av';
import AnimatedAlert from '../components/AnimatedAlert';
import apiClient from '../utils/apiClient';

const IA_API_URL = "http://semillitas.duckdns.org/api/ia/evaluate";

const DrawingGame = ({ activityData, childId, onFinishGame }) => {
    const signatureRef = useRef();
    const [loading, setLoading] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState("");
    const [sound, setSound] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // Consumimos los datos de tu BD
    const objectiveLetter = activityData?.objectiveLetter || 'A';
    const objectiveSentence = activityData?.objectiveSentence || '¡Dibuja la letra!';
    const characterImageUrl = activityData?.imageUrl || activityData?.backgroundImage;
    const audioUrl = activityData?.audio_model_url; // Sacamos la URL del audio

    // FUNCIÓN PARA REPRODUCIR EL AUDIO
    const playInstructionAudio = async () => {
        if (!audioUrl) {
            console.log("No hay URL de audio en la base de datos");
            return;
        }
        try {
            console.log('Reproduciendo audio desde:', audioUrl);
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioUrl },
                { shouldPlay: true }
            );
            setSound(newSound);
        } catch (error) {
            console.error("❌ Error al reproducir audio:", error);
        }
    };

    // Limpiar el audio de la memoria cuando cambies de pantalla
    useEffect(() => {
        return sound ? () => { sound.unloadAsync(); } : undefined;
    }, [sound]);

    const handleSignature = async (signatureBase64) => {
        setLoading(true);
        try {
            const response = await axios.post(IA_API_URL, {
                image: signatureBase64,
                objectiveLetter: objectiveLetter 
            });

            const { success, predictedLetter, confidence, isCorrect } = response.data;

            // Siempre guardar el intento de letra (para métricas de letras difíciles)
            try {
                await apiClient.post('/api/activities/letter-attempt', {
                    sonId: childId,
                    activityId: activityData?.id,
                    objectiveLetter: objectiveLetter,
                    predictedLetter: predictedLetter || 'N/A',
                    confidence: confidence || 0,
                    isCorrect: isCorrect || false
                });
            } catch (err) {
                console.log("Error guardando intento de letra:", err);
            }

            if (success && isCorrect) {
                let estrellas = 1;
                if (confidence >= 95) estrellas = 3;
                else if (confidence >= 80) estrellas = 2;

                if (onFinishGame) onFinishGame({ score: estrellas, status: 'completed' });
            } else {
                setAlertMessage(`Dibujaste una ${predictedLetter}. ¡Intenta que se parezca más a la ${objectiveLetter}!`);
                setShowAlert(true);
                signatureRef.current.clearSignature();
            }
        } catch (error) {
            console.error("❌ Error conectando con la IA:", error);
            setAlertMessage("No pudimos evaluar tu dibujo. Intenta de nuevo 🌟");
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    const webStyle = `
        .m-signature-pad { background-color: transparent !important; box-shadow: none; border: none; }
        .m-signature-pad--body { background-color: transparent !important; border: none; }
        .m-signature-pad--body canvas { background-color: transparent !important; }
        .m-signature-pad--footer { display: none; margin: 0px; }
        body,html { 
            width: 100%; height: 100%; 
            background-color: transparent !important; 
            margin: 0; padding: 0; 
            display: flex; justify-content: center; align-items: center; 
        }
        body::before {
            content: '${objectiveLetter}';
            position: absolute;
            font-size: 220px;
            color: rgba(0, 0, 0, 0.15);
            font-family: sans-serif;
            font-weight: bold;
            z-index: -1;
        }
    `;

    return (
        <View style={styles.container}>
            
            {/* 1. TÍTULO TOCABLE CON AUDIO */}
            <TouchableOpacity 
                style={styles.gameHeader} 
                onPress={playInstructionAudio}
                activeOpacity={0.7}
            >
                <Text style={styles.instructionsText}>
                    {objectiveSentence} <Text style={styles.speakerIcon}>🔊</Text>
                </Text>
            </TouchableOpacity>

            {/* 2. IMAGEN DEL PERSONAJE */}
            {characterImageUrl && (
                <Image 
                    source={{ uri: characterImageUrl }} 
                    style={styles.characterImage} 
                    resizeMode="contain"
                />
            )}

            {/* 3. CONTENEDOR DEL LIENZO */}
            <View style={styles.canvasContainer}>
                <View style={styles.signatureWrapper}>
                    <SignatureScreen
                        ref={signatureRef}
                        onOK={handleSignature}
                        webStyle={webStyle}
                        penColor="rgba(0,0,0,1)"
                        penMinWidth={12}
                        penMaxWidth={15}
                        backgroundColor="transparent"
                    />
                </View>
            </View>

            {/* 4. BOTONES */}
            <View style={styles.buttonRow}>
                <TouchableOpacity 
                    style={[styles.btn, styles.btnClear]} 
                    onPress={() => signatureRef.current.clearSignature()}
                    disabled={loading}
                >
                    <Text style={styles.btnText}>Borrar 🗑️</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.btn, styles.btnSubmit]} 
                    onPress={() => signatureRef.current.readSignature()} 
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.btnText}>¡Listo! ✨</Text>
                    )}
                </TouchableOpacity>
            </View>

{/* 🌟 COMBINACIÓN PERFECTA: Animación del equipo + Tus textos de la IA 🌟 */}
            <AnimatedAlert
                visible={showErrorModal || showAlert} // Se activa con cualquiera de los dos estados
                type="warning"
                title="¡Casi lo logras! 🤔" // Tu título amigable
                message={errorModalMessage || alertMessage} // Prioriza tu mensaje de la IA, si no, usa el de ellos
                buttonText="INTENTAR DE NUEVO ↻" // Tu botón de reintento
                onPress={() => {
                    if (setShowErrorModal) setShowErrorModal(false);
                    if (setShowAlert) setShowAlert(false);
                }}
                character="seed"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%',
        paddingVertical: 20
    },
    
    // ACOMODO DEL TEXTO
    gameHeader: { 
        marginBottom: 15, 
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Un fondito sutil para resaltar
        paddingVertical: 10,
        borderRadius: 20,
    },
    instructionsText: { 
        fontSize: 26, // Más grande y legible
        color: '#FFFFFF', 
        fontWeight: 'bold', 
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 3
    },
    speakerIcon: {
        fontSize: 24,
    },

    characterImage: {
        width: 200,
        height: 200,
        marginBottom: 15,
        borderRadius: 25,
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    canvasContainer: {
        width: 300,
        height: 300,
        backgroundColor: '#FFF',
        borderRadius: 20,
        borderWidth: 4,
        borderColor: '#FFEB3B',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        position: 'relative' 
    },
    signatureWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2, 
    },
    buttonRow: { flexDirection: 'row', marginTop: 30, gap: 20 },
    btn: { paddingVertical: 15, paddingHorizontal: 30, borderRadius: 25, elevation: 3 },
    btnClear: { backgroundColor: '#FF5252' },
    btnSubmit: { backgroundColor: '#4CAF50' },
    btnText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' }
});


const localStyles = StyleSheet.create({
    instructionButton: {
        alignSelf: 'center', zIndex: 10, position: 'absolute', top: 10,
        padding: 10, borderRadius: 20
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
    continueText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default DrawingGame;