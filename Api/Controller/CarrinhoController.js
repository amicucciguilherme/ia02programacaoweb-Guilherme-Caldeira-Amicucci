const Carrinho = require('../model/Carrinho');
const Produto = require('../model/Produto');

module.exports = class CarrinhoController {
  static async addItem(req, res) {
    const { produtoId, quantidade = 1 } = req.body;
    if (!produtoId) {
      return res.status(422).json({ message: 'O produto é obrigatório!' });
    }

    try {
      const produto = await Produto.findByPk(produtoId);
      if (!produto) {
        return res.status(404).json({ message: 'Produto não encontrado!' });
      }

      let itemExistente = await Carrinho.findOne({ where: { produtoId } });
      if (itemExistente) {
        itemExistente.quantidade += Number(quantidade);
        await itemExistente.save();
        return res.status(200).json({ message: 'Quantidade atualizada no carrinho!', item: itemExistente });
      }

      const novoItem = await Carrinho.create({ produtoId, quantidade: Number(quantidade) });
      res.status(201).json({ message: 'Produto adicionado ao carrinho!', item: novoItem });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao adicionar ao carrinho: ' + err });
    }
  }

  static async getAll(req, res) {
    try {
      const itens = await Carrinho.findAll({ include: [Produto] });
      res.status(200).json(itens);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar carrinho: ' + err });
    }
  }

  static async updateQuantidade(req, res) {
    const { id } = req.params;
    const { quantidade } = req.body;

    try {
      const item = await Carrinho.findByPk(id);
      if (!item) {
        return res.status(404).json({ message: 'Item não encontrado no carrinho!' });
      }

      if (Number(quantidade) <= 0) {
        await item.destroy();
        return res.status(200).json({ message: 'Item removido do carrinho!' });
      }

      item.quantidade = Number(quantidade);
      await item.save();
      res.status(200).json({ message: 'Quantidade atualizada!', item });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao atualizar item: ' + err });
    }
  }

  static async removeItem(req, res) {
    const { id } = req.params;
    try {
      const item = await Carrinho.findByPk(id);
      if (!item) {
        return res.status(404).json({ message: 'Item não encontrado no carrinho!' });
      }
      await item.destroy();
      res.status(200).json({ message: 'Item removido do carrinho!' });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao remover item: ' + err });
    }
  }

  static async clear(req, res) {
    try {
      await Carrinho.destroy({ where: {} });
      res.status(200).json({ message: 'Carrinho esvaziado!' });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao esvaziar carrinho: ' + err });
    }
  }
};