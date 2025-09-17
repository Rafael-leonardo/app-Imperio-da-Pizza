import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import sequelize from "./db.js"

import route_produto from "./routes/route_produto.js"
import route_pedido from "./routes/route_pedido.js"
import route_item_pedido from "./routes/route_item_pedido.js"

const app = express()

app.use(cors())
app.use(bodyParser.json())

//rotas
app.use("/", route_produto)
app.use("/pedidos", route_pedido)
app.use("/itens_pedido", route_item_pedido)

app.get("/", (req, res) => {
    res.send("Backend ta On meu fi")
})

const PORT = 3000

sequelize.sync({ alter: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`)
    })
}) .catch((err) => {
    console.error("Erro na sinconizacao: ", err)
})