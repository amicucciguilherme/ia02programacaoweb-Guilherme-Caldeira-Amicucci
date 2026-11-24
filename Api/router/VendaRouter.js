const router = require('express').Router();
const VendaController = require('../Controller/VendaController.js');

router.post('/finalizar', VendaController.finalizarVenda);
router.get('/getAll', VendaController.getAll);

module.exports = router;