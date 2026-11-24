const { DataTypes } = require("sequelize");
const db = require('../db/conn.js');
const Produto = require('./Produto.js');

const Carrinho = db.define('Carrinho', {
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
});

Carrinho.belongsTo(Produto, { foreignKey: 'produtoId', onDelete: 'CASCADE' });
Produto.hasMany(Carrinho, { foreignKey: 'produtoId' });

module.exports = Carrinho;