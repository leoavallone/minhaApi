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

router.post("/reversal", async (req, res) => {
    try {
        const { saleId } = req.body;
        const { productIdToReturn } = req.body;
        const originalSale = await Sale.findById(saleId);
        if (!originalSale) return res.status(404).json({ message: 'Venda não encontrada.' });
        if (!Array.isArray(productIdToReturn)) {
            productIdToReturn = [productIdToReturn];
        }
        const remainingProducts = originalSale.products.filter(p =>
            !productIdToReturn.includes(p.product._id.toString())
        );
        
        if (remainingProducts.length === 0) {
            originalSale.status = 'returned';
            await originalSale.save();
            return res.json({ message: 'Todos os produtos foram devolvidos. Venda marcada como devolvida.' });
        }
        originalSale.status = 'partially_returned';
        await originalSale.save();

        // Criar nova venda com os produtos restantes
        const newSale = new Sale({
            user: originalSale.user,
            products: remainingProducts,
            originalSale: originalSale._id
        });
        await newSale.save();

        res.status(201).json({ message: 'Item devolvido e nova venda criada.', newSale });
     } catch (error) {
       // Retorna um erro caso algo falhe
       return res.status(500).send({ message: `Erro ao estornar venda` });
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