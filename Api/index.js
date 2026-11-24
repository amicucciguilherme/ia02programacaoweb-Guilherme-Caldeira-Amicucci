const express = require('express');
const app = express();
const port = 5000;
const conn = require('./db/conn.js');
const cors = require('cors');

app.use(express.json());
app.use(cors({ credentials: true, origin: '*' }));
app.use('/images', express.static('public/images'));

const ProdutoRouter = require('./router/ProdutoRouter.js');
const CarrinhoRouter = require('./router/CarrinhoRouter.js');
const VendaRouter = require('./router/VendaRouter.js');

app.use('/Produto', ProdutoRouter);
app.use('/Carrinho', CarrinhoRouter);
app.use('/Venda', VendaRouter);

app.use((err, req, res, next) => {
  if (err) {
    return res.status(422).json({ message: err.message });
  }
  next();
});

conn
  .sync({ alter: true })
  .then(() => {
    app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
  })
  .catch((err) => console.log(err));