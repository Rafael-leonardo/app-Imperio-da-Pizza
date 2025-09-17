import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Pedido from './pedido.js';
import Produto from './produto.js';

const ItemPedido = sequelize.define("ItemPedido", {
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  preco: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  observacao: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, { timestamps: true });

Pedido.hasMany(ItemPedido, { foreignKey: 'pedidoId', as: 'itens' });
ItemPedido.belongsTo(Pedido, { foreignKey: 'pedidoId' });

Produto.hasMany(ItemPedido, { foreignKey: 'produtoId', as: 'itens' });
ItemPedido.belongsTo(Produto, { foreignKey: 'produtoId' });

export default ItemPedido;
