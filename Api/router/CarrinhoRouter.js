const router = require('express').Router();
const CarrinhoController = require('../Controller/CarrinhoController.js');

router.post('/add', CarrinhoController.addItem);
router.get('/getAll', CarrinhoController.getAll);
router.patch('/update/:id', CarrinhoController.updateQuantidade);
router.delete('/delete/:id', CarrinhoController.removeItem);
router.delete('/clear', CarrinhoController.clear);

module.exports = router;