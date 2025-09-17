import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com SQLite estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao banco:', error);
  }
})();

export default sequelize;
