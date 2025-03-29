const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Product = require('../product');

router.post("/", async (req, res) => {
    try {
        const { price } = req.body;
        if (price <= 5) {
            return res.status(400).send({ message: "O Produto deve ter custo minimo de 5 reais" });
        }
        const product = new Product(req.body);
        await product.save();
        return res.status(201).send(product.toJSON());
    } catch (error) {
        return res.status(501).send({ message: `${error.message} - erro ao cadastrar produto` });
    }
});


router.get("/",async (req, res) => {
    try {
        const products = await Product.find();
        console.log("Products", products)
        return res.status(200).json(products);
    } catch (error) {
        res.status(500).send({message: `${error.message} - erro ao procurar produto`})
    }
});

router.delete("/:id",async (req, res) => {
    try {

        const name = "Monitor" 

        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send({ message: "Produto não encontrado" });
        }
        if (product.name === name){
            return res.status(403).send({ message: "Este produto não pode ser deletado"});
        }
        return res.status(200).send({ message: "Produto deletado com sucesso!" });
    } catch (error) {
        res.status(500).send({message: `${error.message} - erro ao deletar produto`})
    }
});

router.put("/:id",async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id,req.body);
        if (!product) {
            return res.status(404).send({ message: "Produto não encontrado" });
        }
        return res.status(200).json({ message: "Produto atualizado com sucesso!" });
    } catch (error) {
        res.status(501).send({message: `${error.message} - erro ao cadastrar produto`})
    }
});

module.exports = router;