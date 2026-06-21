const express = require('express');
const router = express.Router();
const { getItems, buyItem } = require('../controllers/shopController');
const verifyJWT = require('../middleware/verifyJWT');

router.get('/items', verifyJWT, getItems);
router.post('/buy', verifyJWT, buyItem);

module.exports = router;