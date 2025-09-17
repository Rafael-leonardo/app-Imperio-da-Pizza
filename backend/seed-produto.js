import fs from "fs";
import path from "path";
import sequelize from "./db.js";
import Produto from "./models/produto.js";

async function popularProdutos() {
  try {
    const filePath = path.join(process.cwd(), "produto.json");
    const data = fs.readFileSync(filePath, "utf-8");
    const produtos = JSON.parse(data);

    await sequelize.authenticate();
    console.log("Banco conectado!");

    for (const produto of produtos) {
      await Produto.create({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        categoria: produto.categoria
      });
    }

    console.log("Produtos populados com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error("Erro ao popular produtos:", err);
    process.exit(1);
  }
}

popularProdutos();
