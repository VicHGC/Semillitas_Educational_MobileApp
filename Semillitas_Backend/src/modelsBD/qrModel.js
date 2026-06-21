const db = require('../config/db');

const QrModel = {
    // 1. Guardar un nuevo token generado
    createToken: async (token, sonId, expirationDate) => {
        const query = 'INSERT INTO tokens_qr (token, son_id, expirationDate) VALUES (?, ?, ?)';
        // Asumiendo que usas una librería tipo mysql2 con promesas
        const [result] = await db.query(query, [token, sonId, expirationDate]);
        return result;
    },

    // 2. Buscar un token específico
    findToken: async (token) => {
        const query = 'SELECT * FROM tokens_qr WHERE token = ?';
        const [rows] = await db.query(query, [token]);
        return rows[0]; // Retorna el primer resultado o undefined
    },

    // 3. Eliminar token (para que no se pueda usar dos veces)
    deleteToken: async (token) => {
        const query = 'DELETE FROM tokens_qr WHERE token = ?';
        await db.query(query, [token]);
    },
    
    // 4. Obtener info básica del niño para devolverla al login
    getSonInfo: async (sonId) => {
        const query = 'SELECT id, son_name, nickname, avatar_url FROM sons_users WHERE id = ?';
        const [rows] = await db.query(query, [sonId]);
        return rows[0];
    }
};

module.exports = QrModel;