const express = require('express');
const router = express.Router()

const {activity, getLessonsList, markActivityComplete, handleLetterAttempt, handleGetDifficultLetters} = require('../controllers/activityEndpoint');

router.get('/lessons/:moduleName/:childId', getLessonsList);

router.get('/:id', activity);

// Rutas de progreso
router.post('/progress', markActivityComplete);

// Rutas de letras difíciles
router.post('/letter-attempt', handleLetterAttempt);
router.get('/difficult-letters/:sonId', handleGetDifficultLetters);

module.exports = router;