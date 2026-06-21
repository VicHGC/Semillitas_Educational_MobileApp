const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_ACCESS_SECRET; 

if (!JWT_SECRET) {
    throw new Error("FATAL ERROR: JWT_ACCESS_SECRET no está definido en el archivo .env");
}

const verifyJWT = (req, res, next) => {
    
    // 1. Obtener el encabezado de autorización
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // 2. Revisar el formato del token
    // Debe empezar con 'Bearer ' y existir
    if (!authHeader?.startsWith('Bearer ')) {

        return res.status(401).json({ 
            message: 'No autorizado: El Token de Autorización (Bearer) es requerido.' 
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        JWT_SECRET,
        (err, decoded) => {
            if (err) {
            // Si hay error (token expirado, firma inválida)
            console.error("Error al verificar JWT:", err.message);
            return res.status(401).json({ 
                message: 'Token inválido o expirado. Vuelva a iniciar sesión.' 
            });
            }
            
            // 5. 🔑 ADJUNTAR EL PAYLOAD: Esto hace que req.user ya no sea undefined
            // Asumiendo que tu token incluye 'userID'
            req.user = decoded; 
            
            next();
        }
    );
};

module.exports = verifyJWT;