const pool = require('../config/db'); // Ajustado a tu archivo real de conexión

const getChildMetricsById = async (childId) => {
    try {
        // 1. OBTENER INFO BÁSICA (Tabla: sons_users)
        const [childInfo] = await pool.query(`
            SELECT 
                id, 
                son_name as name, 
                nickname,
                age, 
                coins, 
                exp_points, 
                avatar_url,
                total_time_played,
                current_streak,
                last_played_date
            FROM sons_users 
            WHERE id = ? 
        `, [childId]);

        if (childInfo.length === 0) return { info: null };

        // 2. OBTENER ÚLTIMA ACTIVIDAD
        // CORRECCIÓN: Usamos 'm.module_name'
        const [lastActivity] = await pool.query(`
            SELECT 
                m.module_name as module_name,
                l.lesson_name as lesson_name,
                ar.score as score,
                ar.completedDate as date
            FROM activity_results ar
            JOIN activities a ON ar.activity_id = a.id
            JOIN lessons l ON a.lesson_id = l.id
            JOIN modules m ON l.module_id = m.id
            WHERE ar.son_id = ?
            ORDER BY ar.completedDate DESC 
            LIMIT 1
        `, [childId]);

        // 3. CALCULAR PROGRESO
        // CORRECCIÓN: Usamos 'm.module_name' en el SELECT y en el GROUP BY
        const [progressData] = await pool.query(`
            SELECT 
                m.module_name as module_name, 
                COUNT(ar.id) as completed_count
            FROM activity_results ar
            JOIN activities a ON ar.activity_id = a.id
            JOIN lessons l ON a.lesson_id = l.id
            JOIN modules m ON l.module_id = m.id
            WHERE ar.son_id = ?
            GROUP BY m.module_name
        `, [childId]);

        // Procesar datos para el Frontend
        let mathProgress = 0;
        let spanishProgress = 0;

        progressData.forEach(row => {
            // Convertimos a minúsculas para comparar fácil
            const modName = row.module_name ? row.module_name.toLowerCase() : "";
            
            // Ajustamos lógica según los nombres reales (ej. "Matemáticas", "Español")
            if (modName.includes('mat') || modName.includes('math')) {
                mathProgress = row.completed_count * 10; 
            }
            if (modName.includes('esp') || modName.includes('span') || modName.includes('writ') || modName.includes('read')) {
                spanishProgress = row.completed_count * 10;
            }
        });

        // Limitar al 100%
        if(mathProgress > 100) mathProgress = 100;
        if(spanishProgress > 100) spanishProgress = 100;

        return {
            info: childInfo[0],
            lastActivity: lastActivity[0] || null,
            metrics: {
                math_progress: mathProgress,
                spanish_progress: spanishProgress
            }
        };
        

    } catch (error) {
        console.error("Error en modelo getChildMetricsById:", error);
        throw error;
    }
};

const deleteChildById = async (childId) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Borrar relaciones en sons_modules (Módulos asignados)
        await connection.query("DELETE FROM sons_modules WHERE son_id = ?", [childId]);

        // 2. Borrar resultados de actividades (activity_results)
        await connection.query("DELETE FROM activity_results WHERE son_id = ?", [childId]);

        // 3. Borrar insights o progresos (insights_progress)
        await connection.query("DELETE FROM insights_progress WHERE son_id = ?", [childId]);

        // 4. Borrar tokens QR si existen
        await connection.query("DELETE FROM tokens_qr WHERE son_id = ?", [childId]);

        // 5. FINALMENTE borrar al usuario hijo (sons_users)
        const [result] = await connection.query("DELETE FROM sons_users WHERE id = ?", [childId]);

        await connection.commit();
        
        // Retorna true si se borró al menos una fila
        return result.affectedRows > 0;

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error eliminando hijo:", error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    getChildMetricsById,
    deleteChildById // <--- ¡No olvides exportarla!
};