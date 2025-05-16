const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Sale = require('../sale');
const jwt = require('jsonwebtoken');

router.post("/", verifyToken, async (req, res) => {
    try {
        const { products } = req.body;
        const sale = new Sale({
            user: req.id,
            products
        });
        const savedSale = await sale.save();
        res.status(201).json(savedSale);
     } catch (error) {
       // Retorna um erro caso algo falhe
       return res.status(500).send({ message: `Erro ao lançar venda` });
   }
});

router.get("/", verifyToken, async (req, res) => {
    try {
        const sales = await Sale.find()
        .populate('user', 'name email')
        .populate('products.product', 'name price');
      res.status(200).json(sales);
    } catch (error) {
        res.status(500).send({message: `Erro ao procurar vendas`})
    }
});

router.get("/me", verifyToken, async (req, res) => {
    try {
        const id = req.id;
        const sales = await Sale.find({ user: id })
        .populate('user', 'name email')
        .populate('products.product', 'name price');
      res.status(200).json(sales);
    } catch (error) {
        res.status(500).send({message: `Erro ao procurar vendas`})
    }
});

router.delete("/", verifyToken, async (req, res) =>{
    try {
        const { saleId } = req.query;
        console.log(saleId);
        const deletedSale = await Sale.findByIdAndDelete(saleId);

    if (!deletedSale) {
      return res.status(404).json({ message: 'Venda não encontrada.' });
    }

        res.json({ message: 'Venda excluída com sucesso.' });
    } catch (error) {
        console.log(error);
        res.status(500).send({message: `Erro ao procurar vendas`})
    }
});

module.exports = router;