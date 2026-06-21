const express = require('express');
const router = express.Router();

const verifyJWT = require('../middleware/verifyJWT');

const { crearHijo } = require('../controllers/SonCreation');
const { obtenerHijos } = require('../controllers/fatherMain'); // Asegúrate de que la ruta sea correcta

// Ruta para crear hijos
router.post('/crearHijo', verifyJWT, crearHijo);

// Nueva ruta para obtener hijos
router.get('/obtenerHijos', verifyJWT, obtenerHijos);

module.exports = router;