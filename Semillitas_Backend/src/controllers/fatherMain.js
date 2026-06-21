const modelBD = require('../modelsBD/sonCreationModel'); 

const obtenerHijos = async (req, res) => { 
    try {
        console.log(`Obteniendo hijos para userID: ${req.user?.userID}`);
        
        const account_id = parseInt(req.user.userID, 10); 
        
        console.log(`ID convertido para consulta: ${account_id}`);

        if (isNaN(account_id) || account_id === 0) {
             console.warn("Fallo de Autenticación: ID no válido después de conversión.");
             return res.status(401).json({ message: "Token inválido o falta el ID de usuario." });
        }

        // Obtener los hijos del usuario
        const hijos = await modelBD.getSonsByAccount(account_id);

        console.log(`Se encontraron ${hijos.length} hijos para la cuenta ${account_id}`);

        res.status(200).json({
            success: true,
            count: hijos.length,
            hijos: hijos
        });

    } catch (error) {
        console.error("Error al obtener los hijos:", error); 
        
        res.status(500).json({
            success: false,
            message: "Error de servidor interno al obtener los hijos.",
            details: error.sqlMessage || error.message
        });
    }
}

module.exports = {
    obtenerHijos
};