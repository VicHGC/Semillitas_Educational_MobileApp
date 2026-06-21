import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { Audio } from 'expo-av';

import { GameLoop } from './system'; 
import entities from './entities'; 

const VoiceGame = forwardRef(({ activityData, onWin }, ref) => {
    const [gameEngine, setGameEngine] = useState(null);
    const [running, setRunning] = useState(true);
    const [sound, setSound] = useState();

    async function playSound() {
        if (!activityData?.audio_model_url) return;

        try {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: activityData.audio_model_url },
                { shouldPlay: true }
            );
            setSound(newSound);

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    // Audio terminó, activamos micrófono en el sistema
                    if (gameEngine) gameEngine.dispatch({ type: 'start-mic' });
                }
            });

        } catch (error) {
            console.error("Error reproduciendo audio:", error);
            // Fallback: activar juego aunque falle el audio
            if (gameEngine) gameEngine.dispatch({ type: 'start-mic' });
        }
    }

    useEffect(() => {
        return () => {
            if (sound) sound.unloadAsync();
            if (gameEngine) gameEngine.dispatch({ type: 'stop-mic' });
        };
    }, [sound]);

    useImperativeHandle(ref, () => ({
        playInstruction: () => {
            playSound();
        }
    }));

    const onEvent = (e) => {
        if (e.type === 'game-won') {
            setRunning(false);
            onWin(); 
        }
    };

    if (!activityData) return null;

    return (
        <View style={styles.container}>
            <GameEngine
                ref={(ref) => { setGameEngine(ref); }}
                style={{ flex: 1, backgroundColor: 'transparent' }}
                systems={[GameLoop]} 
                entities={entities(activityData)} 
                onEvent={onEvent}
                running={running}
            />
        </View>
    );
});

export default VoiceGame;

const styles = StyleSheet.create({
    container: { flex: 1 }
});