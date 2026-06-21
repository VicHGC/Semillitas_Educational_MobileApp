const pool = require('../config/db');

const getSonHomeData = async (childId) => {
    try {
        // 1. Obtener Stats (Monedas, XP, Nombre, Avatar)
        const [sonData] = await pool.query(`
            SELECT 
                son_name, 
                coins, 
                exp_points,
                avatar_url,
                total_time_played,
                current_streak,
                last_played_date
            FROM sons_users 
            WHERE id = ?
        `, [childId]);

        if (sonData.length === 0) return null;

        // 2. (Opcional) Ver qué módulos tiene activos el niño
        // Esto servirá para saber si habilitamos los botones de Mate o Español
        const [modulesData] = await pool.query(`
            SELECT m.module_name 
            FROM sons_modules sm
            JOIN modules m ON sm.module_id = m.id
            WHERE sm.son_id = ?
        `, [childId]);

        return {
            stats: sonData[0],
            modules: modulesData // Array de objetos ej: [{ module_name: 'Matemáticas' }]
        };

    } catch (error) {
        console.error("Error en sonMainModel:", error);
        throw error;
    }
};

module.exports = {
    getSonHomeData
};