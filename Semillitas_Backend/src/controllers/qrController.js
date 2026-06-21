const QrModel = require('../modelsBD/qrModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// A. Generar el QR (Lo llama el Padre)
exports.generateQR = async (req, res) => {
    try {
        const { sonId } = req.body; // El padre envía el ID del hijo que quiere conectar

        if (!sonId) return res.status(400).json({ message: "Falta el ID del hijo" });

        // 1. Generar un token único y aleatorio
        const token = crypto.randomBytes(32).toString('hex');

        // 2. Definir expiración (ej. 10 minutos desde ahora)
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 10);

        // 3. Guardar en la BD
        await QrModel.createToken(token, sonId, expirationDate);

        // 4. Enviar el token al frontend para que pinte el QR
        // OJO: El QR ahora solo contendrá este string largo "token"
        res.status(200).json({ 
            success: true, 
            qrToken: token,
            expiration: expirationDate 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al generar QR" });
    }
};

// B. Procesar el Escaneo (Lo llama el Hijo)
exports.linkDevice = async (req, res) => {
    try {
        const { qrToken } = req.body; // El hijo envía el token que leyó del QR

        // 1. Buscar el token en la BD
        const tokenRecord = await QrModel.findToken(qrToken);

        if (!tokenRecord) {
            return res.status(404).json({ message: "Código QR inválido o no existe" });
        }

        // 2. Verificar si ha expirado
        const now = new Date();
        const expiration = new Date(tokenRecord.expirationDate);
        
        if (now > expiration) {
            // Opcional: Borrar token expirado
            await QrModel.deleteToken(qrToken); 
            return res.status(400).json({ message: "El código QR ha expirado" });
        }

        // 3. Si es válido, obtenemos datos del niño
        const sonData = await QrModel.getSonInfo(tokenRecord.son_id);

        // 4. Generar el JWT para que el hijo quede logueado
        const accessToken = jwt.sign(
            { 
                id: sonData.id, 
                role: 'CHILD',
                name: sonData.son_name 
            },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '365d' }
        );

        // 5. BORRAR el token usado (seguridad: un solo uso)
        await QrModel.deleteToken(qrToken);

        // 6. Responder con el token de sesión
        res.status(200).json({
            success: true,
            accessToken: accessToken,
            userRole: 'CHILD',
            sonData: sonData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al vincular dispositivo" });
    }
};
