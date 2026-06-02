const express = require('express');
const auth = require('../middlewares/auth');
const { resumoMensal } = require('../controllers/resumoController');
const router = express.Router();

router.get('/mensal', auth, resumoMensal);

module.exports = router;
