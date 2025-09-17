import express from "express";
import Pedido from "../models/pedido.js";
import ItemPedido from "../models/item_pedido.js";
import Produto from "../models/produto.js";

const router = express.Router();

// Listar todos os pedidos
router.get("/", async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [{ model: ItemPedido, as: "itens", include: [Produto] }],
    });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar novo pedido
router.post("/", async (req, res) => {
  try {
    const { nome_cliente, telefone, cep, rua, numero, bairro, total, itens } = req.body;

    const novoPedido = await Pedido.create({ nome_cliente, telefone, cep, rua, numero, bairro, total });

    if (itens && itens.length > 0) {
      for (let item of itens) {
        await ItemPedido.create({
          pedidoId: novoPedido.id,
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          preco: item.preco,
          observacao: item.observacao || null,
        });
      }
    }

    const pedidoCompleto = await Pedido.findByPk(novoPedido.id, {
      include: [{ model: ItemPedido, as: "itens", include: [Produto] }],
    });

    res.json(pedidoCompleto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar status do pedido
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const pedido = await Pedido.findByPk(id);
    if (!pedido) return res.status(404).json({ error: "Pedido não encontrado" });

    pedido.status = status;
    await pedido.save();

    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar status do pedido" });
  }
});

// Gerar nota fiscal
router.get("/:id/nota", async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await Pedido.findByPk(id, {
      include: [{ model: ItemPedido, as: "itens", include: [Produto] }],
    });

    if (!pedido) return res.status(404).json({ error: "Pedido não encontrado" });

    let nota = `
================= NOTA FISCAL =================

Cliente: ${pedido.nome_cliente}
Telefone: ${pedido.telefone}
Endereço: ${pedido.rua}, ${pedido.numero} - ${pedido.bairro}
CEP: ${pedido.cep}

----------------------------------------------------
Itens                  Qtd   Preço Unit   Total Item
----------------------------------------------------
`;

    pedido.itens.forEach(item => {
      const nome = item.Produto.nome.padEnd(20, " ");           
      const qtd = String(item.quantidade).padEnd(5, " ");     
      const preco = String(item.preco.toFixed(2)).padStart(12, " "); 
      const totalItem = (item.preco * item.quantidade).toFixed(2).padStart(12, " "); 
      nota += `${nome}${qtd}${preco}${totalItem}\n`;
    });

    nota += `----------------------------------------------------
TOTAL DO PEDIDO: R$ ${pedido.total.toFixed(2)}
====================================================\n`;

    res.json({ nota });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar nota fiscal" });
  }
});

export default router;
