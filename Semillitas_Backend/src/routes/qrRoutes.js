const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');

// Ruta para que el PADRE genere el código
// POST http://tu-ip:3000/api/qr/generate
router.post('/generate', qrController.generateQR);

// Ruta para que el HIJO se conecte escaneando
// POST http://tu-ip:3000/api/qr/link
router.post('/link', qrController.linkDevice);

module.exports = router;