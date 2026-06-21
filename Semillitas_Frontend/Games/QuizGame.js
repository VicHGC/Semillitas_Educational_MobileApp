import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Audio } from 'expo-av';
import AnimatedAlert from '../components/AnimatedAlert';

const QuizGame = forwardRef(({ activityData, onWin }, ref) => {
    const [sound, setSound] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [options, setOptions] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [imageLoading, setImageLoading] = useState(true);

    const rightAnswer = activityData?.rightAnswer?.trim();
    const problemText = activityData?.problemSentence;
    const imageProblem = activityData?.imageProblem;
    const audioSentence = activityData?.audioSentence;

    useEffect(() => {
        generateOptions();
    }, [rightAnswer]);

    useEffect(() => {
        return () => {
            if (sound) sound.unloadAsync();
        };
    }, [sound]);

    const generateOptions = () => {
        if (!rightAnswer) return;
        
        const correct = parseInt(rightAnswer);
        if (isNaN(correct)) {
            setOptions([]);
            return;
        }

        const optionsSet = new Set([correct]);
        
        // Rango dinámico: ±15 del valor correcto (mínimo 0)
        const minValue = Math.max(0, correct - 15);
        const maxValue = correct + 15;
        
        let attempts = 0;
        const maxAttempts = 100; // Evitar loop infinito
        
        while (optionsSet.size < 4 && attempts < maxAttempts) {
            const offset = Math.floor(Math.random() * 31) - 15;
            const num = correct + offset;
            if (num >= minValue && num <= maxValue) {
                optionsSet.add(num);
            }
            attempts++;
        }

        const shuffled = Array.from(optionsSet).sort(() => Math.random() - 0.5);
        setOptions(shuffled);
    };

    const playInstructionAudio = async () => {
        if (!audioSentence) return;

        try {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioSentence },
                { shouldPlay: true }
            );
            setSound(newSound);
        } catch (error) {
            console.error("Error reproduciendo audio:", error);
        }
    };

    useImperativeHandle(ref, () => ({
        playInstruction: () => {
            playInstructionAudio();
        }
    }));

    const handleSelectAnswer = (answer) => {
        if (selectedAnswer !== null) return;
        
        setSelectedAnswer(answer);
        const correct = rightAnswer.trim();
        
        if (String(answer) === correct) {
            setIsCorrect(true);
            setTimeout(() => {
                onWin();
            }, 500);
        } else {
            setIsCorrect(false);
            setAlertMessage("¡Intenta de nuevo! Podrás hacerlo");
            setShowAlert(true);
        }
    };

    const handleAlertDismiss = () => {
        setShowAlert(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    if (!activityData) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#FFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            
            {/* 1. HEADER TOCABLE CON AUDIO */}
            <TouchableOpacity 
                style={styles.gameHeader} 
                onPress={playInstructionAudio}
                activeOpacity={0.7}
            >
                <Text style={styles.instructionsText}>
                    {problemText || '¿Cuánto es?'} <Text style={styles.speakerIcon}>🔊</Text>
                </Text>
            </TouchableOpacity>

            {/* 2. IMAGEN DEL PROBLEMA - CON BORDES Y LOADING */}
            {imageProblem && (
                <View style={styles.imageContainer}>
                    {imageLoading && (
                        <View style={styles.imageLoadingOverlay}>
                            <ActivityIndicator size="large" color="#FFD700" />
                            <Text style={styles.imageLoadingText}>Cargando imagen...</Text>
                        </View>
                    )}
                    <Image 
                        source={{ uri: imageProblem }} 
                        style={styles.problemImage} 
                        resizeMode="cover"
                        onLoadStart={() => setImageLoading(true)}
                        onLoadEnd={() => setImageLoading(false)}
                        onError={() => setImageLoading(false)}
                    />
                </View>
            )}

            {/* 3. OPCIONES DIRECTAMENTE VISIBLES */}
            <View style={styles.optionsContainer}>
                <Text style={styles.chooseText}>Elige la respuesta:</Text>
                
                <View style={styles.optionsRow}>
                    {options.map((opt, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.optionButton,
                                selectedAnswer === opt && isCorrect === true && styles.correctOption,
                                selectedAnswer === opt && isCorrect === false && styles.wrongOption,
                            ]}
                            onPress={() => handleSelectAnswer(opt)}
                            disabled={selectedAnswer !== null}
                        >
                            <Text style={styles.optionText}>{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <AnimatedAlert
                visible={showAlert}
                type="warning"
                title="¡Casi!"
                message={alertMessage}
                buttonText="¡Yo puedo!"
                onPress={handleAlertDismiss}
                character="thinking"
            />
        </View>
    );
});

export default QuizGame;

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%',
        paddingVertical: 20
    },
    
    // HEADER
    gameHeader: { 
        marginBottom: 20, 
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingVertical: 12,
        borderRadius: 20,
    },
    instructionsText: { 
        fontSize: 26, 
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

    // IMAGEN - CON BORDES DIFUMINADOS
    imageContainer: {
        width: 280,
        height: 280,
        marginBottom: 30,
        borderRadius: 25,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    problemImage: {
        width: '100%',
        height: '100%',
    },
    imageLoadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    imageLoadingText: {
        color: '#FFF',
        fontSize: 14,
        marginTop: 10,
        fontWeight: '600',
    },

    // OPCIONES
    optionsContainer: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    chooseText: {
        fontSize: 20,
        color: '#FFF',
        marginBottom: 20,
        fontWeight: '600',
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    optionButton: {
        backgroundColor: '#2196F3',
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    correctOption: {
        backgroundColor: '#4CAF50',
    },
    wrongOption: {
        backgroundColor: '#F44336',
    },
    optionText: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
});