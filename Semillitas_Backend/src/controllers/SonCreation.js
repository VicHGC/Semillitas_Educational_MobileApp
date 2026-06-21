const modelBD = require('../modelsBD/sonCreationModel'); 

const crearHijo = async (req, res) => { 

    // 1. Extraemos el avatar_url que viene desde el frontend (req.body)
    const {name, age, modules, avatar_url} = req.body;

    try{
        console.log(`Datos token recibidos: userID=${req.user?.userID}, Tipo: ${typeof req.user?.userID}`);
        
        const account_id = parseInt(req.user.userID, 10); 
        
        console.log(`ID convertido usado para buscar padre: ${account_id}`);

        if (isNaN(account_id) || account_id === 0) {
             console.warn("Fallo de Autenticación: ID no válido después de conversión.");
             return res.status(401).json({ message: "Token inválido o falta el ID de usuario." });
        }

        const padre = await modelBD.findFather(account_id);

        if(!padre){
            return res.status(404).json({ message: "El padre asociado a esta cuenta no fue encontrado." });
        }

        console.log(`IDs finales para inserción: account_id=${account_id}, padre_id=${padre.id}`);

        // 2. Le pasamos el avatar_url a la función del modelo BD
        const nuevoHijo = await modelBD.createSon(name, age, modules, account_id, padre.id, avatar_url);

        res.status(201).json(nuevoHijo);

    } catch (error){
        console.error("FATAL ERROR EN CREAR HIJO (Revisar Claves Foráneas o Conexión):", error); 
        
        res.status(500).json({
            message: "Error de servidor interno. Revisa los logs del backend para más detalles.",
            details: error.sqlMessage || error.message 
        });
    }
}

module.exports = {
    crearHijo
}
