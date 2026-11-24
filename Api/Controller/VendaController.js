const Venda = require('../model/Venda');
const Carrinho = require('../model/Carrinho');
const Produto = require('../model/Produto');

module.exports = class VendaController {
  static async finalizarVenda(req, res) {
    try {
      const itensCarrinho = await Carrinho.findAll({ include: [Produto] });
      if (!itensCarrinho || itensCarrinho.length === 0) {
        return res.status(422).json({ message: 'O carrinho está vazio!' });
      }

      let valorTotal = 0;
      const resumoItens = itensCarrinho.map((item) => {
        const subtotal = Number(item.Produto.preco) * item.quantidade;
        valorTotal += subtotal;
        return {
          produtoId: item.produtoId,
          nome: item.Produto.nome,
          precoUnitario: Number(item.Produto.preco),
          quantidade: item.quantidade,
          subtotal
        };
      });

      const novaVenda = await Venda.create({
        valorTotal,
        itens: JSON.stringify(resumoItens)
      });

      await Carrinho.destroy({ where: {} });

      res.status(201).json({ message: 'Venda finalizada com sucesso!', venda: novaVenda });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao finalizar venda: ' + err });
    }
  }

  static async getAll(req, res) {
    try {
      const vendas = await Venda.findAll({ order: [['createdAt', 'DESC']] });
      res.status(200).json(vendas);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar vendas: ' + err });
    }
  }
};