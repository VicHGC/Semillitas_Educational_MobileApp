const sonMainModel = require('../modelsBD/sonMainModel');

const getHomeDetails = async (req, res) => {
    try {
        const { childId } = req.params;

        if (!childId) {
            return res.status(400).json({ success: false, message: "Falta el ID del hijo" });
        }

        const data = await sonMainModel.getSonHomeData(childId);

        if (!data) {
            return res.status(404).json({ success: false, message: "Hijo no encontrado" });
        }

        // --- CÁLCULO DE NIVEL ---
        const xp = data.stats.exp_points || 0;
        const xpPerLevel = 100; // Cada 100 puntos sube de nivel

        // Ejemplo: 250 XP -> Nivel 3 (Math.floor(2.5) + 1)
        const currentLevel = Math.floor(xp / xpPerLevel) + 1;
        
        // Ejemplo: 250 XP -> 50% de progreso del nivel actual
        const currentProgressPercent = xp % xpPerLevel; 

        res.status(200).json({
            success: true,
            data: {
                name: data.stats.son_name,
                coins: data.stats.coins || 0,
                xpTotal: xp,
                level: currentLevel,
                levelProgress: currentProgressPercent, // Esto usaremos para la barra (0 a 100)
                activeModules: data.modules.map(m => m.module_name), // ['Matemáticas', 'Español']
                avatar_url: data.stats.avatar_url || null
            }
        });

    } catch (error) {
        console.error("Error en sonMainController:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

module.exports = {
    getHomeDetails
};