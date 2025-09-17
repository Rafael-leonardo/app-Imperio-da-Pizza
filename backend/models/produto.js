import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Produto = sequelize.define("Produto", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preco: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { timestamps: true });

export default Produto;
