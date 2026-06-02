const express = require('express');
const auth = require('../middlewares/auth');
const controller = require('../controllers/despesaController');
const router = express.Router();

router.use(auth);
router.get('/', controller.listar);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.remover);

module.exports = router;
