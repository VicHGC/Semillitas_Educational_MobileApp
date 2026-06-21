const { searchActivity, searchMathActivity, getLessonsByModuleName, getChildProgress, saveActivityProgress, addRewards, updateChildActivityMetrics, saveLetterAttempt, getDifficultLetters } = require('../modelsBD/activityModel');

const activity = async (req, res) => {
    const {id} = req.params;

    try{
        // Primero obtenemos el tipo de actividad para saber dónde buscar
        const activityCheck = await searchActivity(id);
        
        if (!activityCheck) {
            return res.status(404).json({ message: "Actividad no encontrada" });
        }

        let activityPacket;
        
        // Según el tipo, buscamos en la tabla correcta
        if (activityCheck.type === 'problema') {
            activityPacket = await searchMathActivity(id);
        } else {
            // voz, caligrafia u otros - buscan en writtingreading_data
            activityPacket = await searchActivity(id);
        }

        res.status(200).json(activityPacket);
    } catch (error){
        console.error("Error en el controlador de actividad", error.message);

        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes("no se pudo encontrar") || errorMessage.includes("missing data")){
            res.status(404).json({ message: errorMessage });
        } else{
            res.status(500).json({ message: "Error interno del servidor." });
        }
    }
}

const getLessonsList = async (req, res) => {
    try {
        const { moduleName, childId } = req.params;

        // 1. Obtener datos crudos (Lecciones + Actividades mezcladas)
        const rawRows = await getLessonsByModuleName(moduleName);
        
        if (!rawRows || rawRows.length === 0) {
            return res.status(200).json({ success: true, structuredLessons: [] });
        }

        // 2. Obtener progreso del niño
        const progress = await getChildProgress(childId);
        const completedSet = new Set(progress.map(p => p.activity_id));
        const scoresMap = {};
        progress.forEach(p => { scoresMap[p.activity_id] = p.score; });

        // 3. Procesar estados (Locked/Unlocked) LINEALMENTE primero
        // Esto asegura que la última actividad de la Lección 1 desbloquee la primera de la Lección 2
        const activitiesWithStatus = rawRows.map((row, index) => {
            const isCompleted = completedSet.has(row.activity_id);
            let status = 'locked';

            if (isCompleted) {
                status = 'completed';
            } else if (index === 0) {
                status = 'unlocked'; // El primer juego de todos siempre está abierto
            } else {
                // Miramos la actividad ANTERIOR (aunque sea de otra lección)
                const prevRow = rawRows[index - 1];
                if (completedSet.has(prevRow.activity_id)) {
                    status = 'unlocked';
                }
            }

            return {
                ...row,
                status,
                score: scoresMap[row.activity_id] || 0
            };
        });

        // 4. AGRUPAR por Lección
        const groupedLessons = [];
        let currentLessonId = -1;
        let currentLessonGroup = null;

        activitiesWithStatus.forEach(item => {
            // Si cambiamos de lección, creamos un nuevo grupo
            if (item.lesson_id !== currentLessonId) {
                currentLessonId = item.lesson_id;
                currentLessonGroup = {
                    id: item.lesson_id,
                    name: item.lesson_name,
                    image: item.lesson_image, // Aquí iría tu fondo de playa/granja
                    activities: []
                };
                groupedLessons.push(currentLessonGroup);
            }

            // Agregamos la actividad al grupo actual
            const objective = item.type === 'problema' 
                ? item.problemSentence 
                : item.objectiveSentence;
            
            currentLessonGroup.activities.push({
                id: item.activity_id,
                type: item.type, // 'voz', 'caligrafia', 'problema'
                objective: objective,
                status: item.status,
                score: item.score
            });
        });

        res.status(200).json({ success: true, lessons: groupedLessons });

    } catch (error) {
        console.error("Error en getLessonsList:", error);
        res.status(500).json({ success: false, message: "Error al obtener lecciones" });
    }
};

const markActivityComplete = async (req, res) => {
    try {
        // Esperamos recibir esto en el cuerpo (body) de la petición POST
        const { childId, activityId, score } = req.body;

        if (!childId || !activityId) {
            return res.status(400).json({ success: false, message: "Faltan datos (childId o activityId)" });
        }

        // Guardamos en la BD (usamos 100 como score por defecto si no viene nada)
        await saveActivityProgress(childId, activityId, score || 100);

        //Damos recompensa por ganar:
        const coinsEarned = 10;
        const xpEarned = 20;
        await addRewards(childId, coinsEarned, xpEarned);

        // Actualizar métricas de actividad (streak, tiempo, última fecha)
        await updateChildActivityMetrics(childId, 5); // 5 minutos por actividad


        res.status(200).json({ 
            success: true, 
            message: "Progreso guardado y recompensas entregadas",
            rewards: {
                coins: coinsEarned,
                xp: xpEarned
            }
        });

    } catch (error) {
        console.error("Error al guardar progreso:", error);
        res.status(500).json({ success: false, message: "Error interno al guardar progreso" });
    }
};

// Guardar intento de letra (caligrafía)
const handleLetterAttempt = async (req, res) => {
    try {
        const { sonId, activityId, objectiveLetter, predictedLetter, confidence, isCorrect } = req.body;
        
        if (!sonId || !objectiveLetter) {
            return res.status(400).json({ success: false, message: "Faltan datos requeridos" });
        }
        
        const saved = await saveLetterAttempt(sonId, activityId, objectiveLetter, predictedLetter, confidence, isCorrect);
        
        if (saved) {
            res.status(200).json({ success: true, message: "Intento de letra guardado" });
        } else {
            res.status(500).json({ success: false, message: "Error al guardar intento" });
        }
    } catch (error) {
        console.error("Error en handleLetterAttempt endpoint:", error);
        res.status(500).json({ success: false, message: "Error interno" });
    }
};

// Obtener letras difíciles
const handleGetDifficultLetters = async (req, res) => {
    try {
        const { sonId } = req.params;
        
        if (!sonId) {
            return res.status(400).json({ success: false, message: "Falta sonId" });
        }
        
        const difficultLetters = await getDifficultLetters(sonId);
        
        res.status(200).json({ 
            success: true, 
            data: difficultLetters 
        });
    } catch (error) {
        console.error("Error en getDifficultLetters endpoint:", error);
        res.status(500).json({ success: false, message: "Error interno" });
    }
};


module.exports = {
    activity,
    getLessonsList,
    markActivityComplete,
    handleLetterAttempt,
    handleGetDifficultLetters
}