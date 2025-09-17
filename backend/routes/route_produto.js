import express from "express"
import Produto from "../models/produto.js"

const router = express.Router()

//listar produtos
router.get("/", async (req, res) => {
    try {
        const produtos = await Produto.findAll()
        res.json(produtos)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//criar produto
router.post("/", async (req, res) => {
    try {
        const { nome, preco, descricao, img, categoria } = req.body
        const novoProduto = await Produto.create({ nome, preco, descricao, img, categoria})
        res.json(novoProduto)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//editar produto
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { nome, preco, descricao, img, caategoria } = req.body

        const produto = await Produto.findByPk(id)
        if (!produto) {
            return res.status(404).json({ error: "produto nao encontrado"})
        }
        await produto.update({ nome, preco, descricao, img, categoria })
        res.json(produto)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//deletar produto
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const produto = await Produto.findByPk(id)
        if (!produto) {
            return res.status(404).json({ error: "produto nao encontrado" })
        }
        await produto.destroy()
        res.json({ message: "Produto removido com sucesso" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

export default router