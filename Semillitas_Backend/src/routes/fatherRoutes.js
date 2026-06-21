const express = require('express');
const router = express.Router();
const fatherController = require('../controllers/fatherSonController');
// Importa tu middleware de Auth (ajusta la ruta según donde lo tengas)
// const verifyToken = require('../middleware/authMiddleware'); 

const verifyToken = require('../middleware/verifyJWT');

// ... otras rutas ...

// Ruta para obtener detalles
// GET /fatherMain/child-metrics/5
router.get('/child-metrics/:childId', verifyToken, fatherController.getChildDetails); 
// Nota: Agrega 'verifyToken' como segundo argumento si quieres protegerla

router.delete('/delete-child/:childId', verifyToken, fatherController.deleteChild);

module.exports = router;