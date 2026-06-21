// archivo donde esta todo lo relacionado a las metricas mostradas al ingresar a la carta de algun hijo

const fatherModel = require('../modelsBD/fatherModel');

const getChildDetails = async (req, res) => {
    try {
        const { childId } = req.params;

        if (!childId) {
            return res.status(400).json({ success: false, message: "Falta el ID del hijo" });
        }

        const data = await fatherModel.getChildMetricsById(childId);

        if (!data || !data.info) {
            return res.status(404).json({ success: false, message: "Hijo no encontrado" });
        }

        // Armamos la respuesta. 
        // Nota: data.info.name ya viene con el nombre correcto gracias al alias en el SQL.
        res.status(200).json({
            success: true,
            data: {
                id: data.info.id,
                name: data.info.name,      // Viene de 'son_name'
                nickname: data.info.nickname,
                age: data.info.age,
                coins: data.info.coins,
                exp_points: data.info.exp_points,
                avatar_url: data.info.avatar_url,
                
                // Nuevas métricas de actividad
                total_time_played: data.info.total_time_played || 0,
                current_streak: data.info.current_streak || 0,
                last_played_date: data.info.last_played_date,
                
                // Métricas calculadas
                metrics: data.metrics, 
                
                // Última actividad (o null si es nuevo)
                lastActivity: data.lastActivity ? {
                    name: data.lastActivity.lesson_name,
                    module: data.lastActivity.module_name,
                    score: data.lastActivity.score,
                    date: data.lastActivity.date
                } : null
            }
        });

    } catch (error) {
        console.error("Error en controlador getChildDetails:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

const deleteChild = async (req, res) => {
    try {
        const { childId } = req.params;

        if (!childId) {
            return res.status(400).json({ success: false, message: "ID del hijo requerido" });
        }

        const deleted = await fatherModel.deleteChildById(childId);

        if (deleted) {
            res.status(200).json({ success: true, message: "Perfil eliminado correctamente" });
        } else {
            res.status(404).json({ success: false, message: "No se encontró el perfil para eliminar" });
        }

    } catch (error) {
        console.error("Error en deleteChild:", error);
        res.status(500).json({ success: false, message: "Error al eliminar el perfil" });
    }
};

module.exports = {
    getChildDetails,
    deleteChild // <--- Exportar
};