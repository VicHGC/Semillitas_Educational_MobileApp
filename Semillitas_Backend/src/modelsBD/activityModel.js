const pool = require('../config/db.js');

/**
 * Busca una actividad y une sus datos específicos (imágenes, audio, etc.)
 * usando un LEFT JOIN con la tabla de detalles (writtingreading_data).
 */
const searchActivity = async (activityId) => {
    try {
        const sql = `
            SELECT 
                a.id, 
                a.type, 
                a.lesson_id,
                -- Datos específicos de la tabla de lectura/escritura/voz
                w.imageUrl, 
                w.backgroundImage, 
                w.audio_model_url, 
                w.objectiveLetter,
                w.objectiveSentence
            FROM activities a
            LEFT JOIN writtingreading_data w ON w.activity_id = a.id
            WHERE a.id = ?
        `;

        const [rows] = await pool.query(sql, [activityId]);
        
        // Retornamos la primera fila encontrada (que ya contiene todo mezclado)
        return rows[0] || null;

    } catch (error) {
        console.error("Error al buscar la actividad:", error);
        throw error;
    }
};

/**
 * Obtiene todas las actividades de un módulo, unidas con su lección.
 * Incluye datos de writtingreading_data Y math_data según el tipo.
 */
const getLessonsByModuleName = async (moduleName) => {
    try {
        const sql = `
            SELECT 
                l.id as lesson_id,
                l.lesson_name,
                a.id as activity_id,
                a.type,
                w.objectiveLetter,
                w.objectiveSentence,
                w.imageUrl,
                w.audio_model_url,
                md.problemSentence,
                md.rightAnswer
            FROM modules m
            JOIN lessons l ON l.module_id = m.id
            JOIN activities a ON a.lesson_id = l.id
            LEFT JOIN writtingreading_data w ON w.activity_id = a.id
            LEFT JOIN math_data md ON md.activity_id = a.id
            WHERE m.module_name = ?
            ORDER BY l.id ASC, a.id ASC
        `;
        const [rows] = await pool.query(sql, [moduleName]);
        return rows;
    } catch (error) {
        throw error;
    }
};

/**
 * Busca el progreso del niño para saber qué candados abrir.
 */
const getChildProgress = async (childId) => {
    try {
        const sql = `SELECT activity_id, score FROM activity_results WHERE son_id = ?`;
        const [rows] = await pool.query(sql, [childId]);
        return rows;
    } catch (error) {
        throw error;
    }
};

/**
 * Guarda el resultado de una actividad.
 * Usa INSERT ... ON DUPLICATE KEY UPDATE para guardar solo el mejor puntaje.
 */
const saveActivityProgress = async (childId, activityId, score) => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        // Asegúrate de tener un índice ÚNICO en tu BD en (son_id, activity_id)
        const sql = `
            INSERT INTO activity_results (son_id, activity_id, score, date_completed)
            VALUES (?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE score = GREATEST(score, VALUES(score)), date_completed = NOW();
        `;

        const [result] = await connection.query(sql, [childId, activityId, score]);
        return result.affectedRows > 0;

    } catch (error) {
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

/**
 * Suma monedas y experiencia al niño.
 */
const addRewards = async (childId, coins, xp) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = `
            UPDATE sons_users 
            SET coins = coins + ?, 
                exp_points = exp_points + ? 
            WHERE id = ?
        `;
        const [result] = await connection.query(sql, [coins, xp, childId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

/**
 * Actualiza las métricas de actividad del niño (streak, tiempo, última fecha)
 * Se llama cada vez que el niño completa una actividad
 */
const updateChildActivityMetrics = async (childId, minutesPlayed = 5) => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        // Obtener datos actuales
        const [child] = await connection.query(
            'SELECT last_played_date, current_streak, total_time_played FROM sons_users WHERE id = ?',
            [childId]
        );
        
        if (child.length === 0) return false;
        
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const lastPlayed = child[0].last_played_date ? new Date(child[0].last_played_date).toISOString().split('T')[0] : null;
        
        let newStreak = child[0].current_streak || 0;
        let newTotalTime = (child[0].total_time_played || 0) + minutesPlayed;
        
        // Calcular streak
        if (lastPlayed === today) {
            // Ya jug hoy, no cambia el streak
        } else if (lastPlayed) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            if (lastPlayed === yesterdayStr) {
                // Jug ayer, suma 1 al streak
                newStreak += 1;
            } else {
                // No jug ni hoy ni ayer, reinicia streak
                newStreak = 1;
            }
        } else {
            // Primera vez que juega
            newStreak = 1;
        }
        
        // Actualizar
        const sql = `
            UPDATE sons_users 
            SET total_time_played = ?,
                current_streak = ?,
                last_played_date = ?
            WHERE id = ?
        `;
        const [result] = await connection.query(sql, [newTotalTime, newStreak, today, childId]);
        return result.affectedRows > 0;
        
    } catch (error) {
        console.error("Error en updateChildActivityMetrics:", error);
        return false;
    } finally {
        if (connection) connection.release();
    }
};

/**
 * Busca una actividad de matemáticas y une sus datos específicos.
 */
const searchMathActivity = async (activityId) => {
    try {
        const sql = `
            SELECT 
                a.id, 
                a.type, 
                a.lesson_id,
                m.problemSentence, 
                m.rightAnswer, 
                m.audioSentence, 
                m.imageProblem
            FROM activities a
            LEFT JOIN math_data m ON m.activity_id = a.id
            WHERE a.id = ?
        `;
        const [rows] = await pool.query(sql, [activityId]);
        return rows[0] || null;
    } catch (error) {
        console.error("Error al buscar actividad de matemáticas:", error);
        throw error;
    }
};

module.exports = {
    searchActivity,
    searchMathActivity,
    getLessonsByModuleName,
    getChildProgress,
    saveActivityProgress,
    addRewards,
    updateChildActivityMetrics
};

/**
 * Guarda un intento de letra (para el sistema de letras difíciles)
 */
const saveLetterAttempt = async (sonId, activityId, objectiveLetter, predictedLetter, confidence, isCorrect) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = `
            INSERT INTO letter_attempts (son_id, activity_id, objective_letter, predicted_letter, confidence, is_correct, created_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        const [result] = await connection.query(sql, [sonId, activityId, objectiveLetter, predictedLetter, confidence, isCorrect]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error en saveLetterAttempt:", error);
        return false;
    } finally {
        if (connection) connection.release();
    }
};

/**
 * Obtiene las letras que más se le dificultan al niño
 */
const getDifficultLetters = async (sonId, limit = 5) => {
    try {
        const sql = `
            SELECT 
                objective_letter,
                COUNT(*) as total_attempts,
                SUM(CASE WHEN is_correct = FALSE THEN 1 ELSE 0 END) as errors,
                ROUND(SUM(CASE WHEN is_correct = FALSE THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) as error_rate
            FROM letter_attempts
            WHERE son_id = ?
            GROUP BY objective_letter
            HAVING total_attempts >= 2
            ORDER BY error_rate DESC, errors DESC
            LIMIT ?
        `;
        const [results] = await pool.query(sql, [sonId, limit]);
        return results;
    } catch (error) {
        console.error("Error en getDifficultLetters:", error);
        return [];
    }
};

module.exports = {
    searchActivity,
    searchMathActivity,
    getLessonsByModuleName,
    getChildProgress,
    saveActivityProgress,
    addRewards,
    updateChildActivityMetrics,
    saveLetterAttempt,
    getDifficultLetters
};