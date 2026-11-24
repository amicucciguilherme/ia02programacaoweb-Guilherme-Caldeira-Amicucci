const router = require('express').Router();
const ProdutoController = require('../Controller/ProdutoController.js');
const { imageUpload } = require('../helpers/image-upload.js');

router.post('/create', imageUpload.single('imagem'), ProdutoController.create);
router.get('/getAll', ProdutoController.getAll);
router.get('/getById/:id', ProdutoController.getById);
router.patch('/update/:id', imageUpload.single('imagem'), ProdutoController.update);
router.delete('/delete/:id', ProdutoController.delete);

module.exports = router;