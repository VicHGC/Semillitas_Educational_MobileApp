const express = require('express');
const router = express.Router();

const {crearUsuario, loginUsuarioEmail} = require('../controllers/userLogin');

router.post('/nuevoUsuario', crearUsuario);
router.post('/loginUsuarioEmail', loginUsuarioEmail);

module.exports = router;