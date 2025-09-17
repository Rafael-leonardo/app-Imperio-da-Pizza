import express from "express"
import ItemPedido from "../models/item_pedido.js"
import Produto from "../models/produto.js"
import Pedido from "../models/pedido.js"

const router = express.Router()

//listar produtos de um pedido
router.get("/:pedidoId", async (req, res) => {
    try {
        const { pedidoId } = req.params
        const itens = await ItemPedido.findAll({
            where: { pedidoId },
            include: [{ model: Produto, as: "Produto"}]
        })
        res.json(itens)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//adicionar item ao pedido
router.post("/", async (req, res) => {
    try {
        const { pedidoId, produtoId, quantidade, preco, observacao } = req.body
        const novoItem = await ItemPedido.create({
            pedidoId,
            produtoId,
            quantidade,
            preco,
            observacao,
        })
        res.json(novoItem)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//atualizar item do pedido
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { quantidade, preco, observacao } = req.body
        const item = await ItemPedido.findByPk(id)

        if (!item) {
            return res.status(404).json({ error: "Item nao encontrado" })
        }
        await item.update({ quantidade, preco, observacao })
        res.json(item)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//deletar item do pedido
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const item = await ItemPedido.findByPk(id)

        if (!item) {
            return res.status(404).json({ error: "item nao encontrado" })
        }
        await item.destroy()
        res.json({ message: "item removido com sucesso" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

export default router