const express = require('express');
const router = express.Router();
const sonMainController = require('../controllers/sonMainController');
const verifyToken = require('../middleware/verifyJWT');
const pool = require('../config/db');

// GET /api/son-home/info/5
router.get('/info/:childId', verifyToken, sonMainController.getHomeDetails);

// PUT /api/son/avatar - Actualizar avatar del hijo
router.put('/avatar', verifyToken, async (req, res) => {
    try {
        const { sonId, avatarUrl } = req.body;
        
        if (!sonId || !avatarUrl) {
            return res.status(400).json({ success: false, message: "Faltan datos" });
        }
        
        await pool.query(
            'UPDATE sons_users SET avatar_url = ? WHERE id = ?',
            [avatarUrl, sonId]
        );
        
        res.status(200).json({ success: true, message: "Avatar actualizado" });
    } catch (error) {
        console.error("Error al actualizar avatar:", error);
        res.status(500).json({ success: false, message: "Error interno" });
    }
});

module.exports = router;