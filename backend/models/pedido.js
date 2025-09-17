import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Pedido = sequelize.define("Pedido", {
  nome_cliente: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cep: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rua: {
    type: DataTypes.STRING,
    allowNull: true
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendente'
  },
  total: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  }
}, { timestamps: true });

export default Pedido;
