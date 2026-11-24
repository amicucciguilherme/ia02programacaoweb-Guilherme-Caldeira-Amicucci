const Produto = require('../model/Produto');

module.exports = class ProdutoController {
  static async create(req, res) {
    const { nome, preco } = req.body;
    const imagem = req.file ? req.file.filename : null;

    if (!nome) {
      return res.status(422).json({ message: 'O nome é obrigatório!' });
    }
    if (preco === undefined || preco === null || preco === '') {
      return res.status(422).json({ message: 'O preço é obrigatório!' });
    }
    if (Number(preco) < 0) {
      return res.status(422).json({ message: 'O preço não pode ser negativo!' });
    }

    const produto = new Produto({ nome, preco, imagem });

    try {
      const novoProduto = await produto.save();
      res.status(201).json({ message: 'Produto criado com sucesso', produto: novoProduto });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao criar o produto: ' + err });
    }
  }

  static async getAll(req, res) {
    try {
      const produtos = await Produto.findAll();
      res.status(200).json(produtos);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar os produtos: ' + err });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(422).json({ message: 'Produto não encontrado!' });
    }
    res.status(200).json(produto);
  }

  static async update(req, res) {
    const { id } = req.params;
    const { nome, preco } = req.body;

    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(422).json({ message: 'Produto não encontrado!' });
    }
    if (!nome) {
      return res.status(422).json({ message: 'O nome é obrigatório!' });
    }
    if (preco === undefined || preco === null || preco === '') {
      return res.status(422).json({ message: 'O preço é obrigatório!' });
    }
    if (Number(preco) < 0) {
      return res.status(422).json({ message: 'O preço não pode ser negativo!' });
    }

    const dadosAtualizados = {
      nome,
      preco,
      imagem: req.file ? req.file.filename : produto.imagem
    };

    try {
      await produto.update(dadosAtualizados);
      res.status(200).json({ message: 'Produto atualizado com sucesso', produto });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao atualizar o produto: ' + err });
    }
  }

  static async delete(req, res) {
    const { id } = req.params;
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(422).json({ message: 'Produto não encontrado!' });
    }

    try {
      await produto.destroy();
      res.status(200).json({ message: 'Produto deletado com sucesso!' });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao deletar o produto: ' + err });
    }
  }
};