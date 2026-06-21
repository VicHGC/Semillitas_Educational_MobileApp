import { Audio } from 'expo-av';

// --- Constantes ---
const LOUDNESS_THRESHOLD = -25; 
const MOVEMENT_SPEED = 4;

// --- Estado global del sistema ---
let recordingInstance = null;
let isMicActive = false;
let lastUpdateTime = Date.now();
let isSoundCurrentlyLoud = false;
let consecutiveLoudFrames = 0;

// --- 1. Sistema de Control (Micrófono y Reset) ---
const ControlSystem = (entities, { events, dispatch }) => {
  events.forEach(async (e) => {
    // AHORA EL COMPONENTE REACT NOS DICE CUANDO ENCENDER EL MICRO
    if (e.type === 'start-mic') {
        await startMicrophone(dispatch);
    }

    if (e.type === 'stop-mic') {
        stopMicrophone();
    }

    if (e.type === 'reset-game') {
        const { bee } = entities;
        bee.progress = 0;
        bee.position = [...bee.initialPosition];
        stopMicrophone();
    }
  });
  return entities;
};

// --- Helper: Iniciar Micrófono ---
const startMicrophone = async (dispatch) => {
  if (isMicActive) return;
  try {
    const perm = await Audio.requestPermissionsAsync();
    if (!perm.granted) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    recordingInstance = recording;
    isMicActive = true;
    console.log("🎤 MICRÓFONO ACTIVADO EN SYSTEM");
    
    // Configurar listener de volumen
    recordingInstance.setOnRecordingStatusUpdate((status) => {
        if (status.metering !== undefined) {
            const isLoud = status.metering > LOUDNESS_THRESHOLD;
            if (isLoud) consecutiveLoudFrames++;
            else consecutiveLoudFrames = 0;

            const shouldMove = consecutiveLoudFrames >= 1;
            
            // Despachamos evento interno para que el BeeSystem lo lea
            if (dispatch) {
                dispatch({ type: 'audio-level-update', isLoud: shouldMove });
            }
        }
    });

  } catch (err) {
    console.error("Error micro:", err);
  }
};

// --- Helper: Detener Micrófono ---
const stopMicrophone = async () => {
    isMicActive = false;
    isSoundCurrentlyLoud = false;
    consecutiveLoudFrames = 0;
    if (recordingInstance) {
        try {
            await recordingInstance.stopAndUnloadAsync();
        } catch(e) {}
        recordingInstance = null;
    }
};

// --- 2. Sistema de Movimiento (La Abeja) ---
const BeeSystem = (entities, { events, dispatch }) => {
  const { bee } = entities;
  
  const currentTime = Date.now();
  const deltaTime = (currentTime - lastUpdateTime) / 1000;
  lastUpdateTime = currentTime;

  // Escuchar actualizaciones de audio
  events.forEach(e => {
      if (e.type === 'audio-level-update') {
          isSoundCurrentlyLoud = e.isLoud;
      }
  });

  // LOGICA DE MOVIMIENTO
  if (isMicActive && isSoundCurrentlyLoud) {
    // Mover abeja
    bee.progress += MOVEMENT_SPEED * deltaTime * 20; // Ajuste de velocidad
    if (bee.progress > 100) bee.progress = 100;

    // Interpolación Lineal (Lerp)
    const startX = bee.initialPosition[0];
    const startY = bee.initialPosition[1];
    const endX = bee.targetPosition[0];
    const endY = bee.targetPosition[1];

    const t = bee.progress / 100;
    
    // Actualizar posición (Simple Lerp)
    bee.position[0] = startX + (endX - startX) * t;
    bee.position[1] = startY + (endY - startY) * t;

    // Checar Victoria
    if (bee.progress >= 100) {
        dispatch({ type: 'game-won' });
        stopMicrophone();
    }
  }

  return entities;
};

// --- Loop Principal ---
export const GameLoop = (entities, { dispatch, events, time }) => {
  let nextEntities = entities;
  nextEntities = ControlSystem(nextEntities, { dispatch, events });
  nextEntities = BeeSystem(nextEntities, { dispatch, events });
  return nextEntities;
};