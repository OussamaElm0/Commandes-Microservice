const express = require('express');
const app = express();
const port = process.env.PORT || 3003;
const mongoose = require('mongoose');
const Stock = require('./Stock');
const checkAuth = require('./auth');
const axios = require('axios');

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/stocks-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.post("/stocks/ajouter", checkAuth, (req, res) => {
    const { produitId, quantite } = req.body;

    const newStock = new Stock({
        produitId,
        quantite
    });

    newStock.save()
        .then(stock => res.status(201).json(stock))
        .catch(() => res.status(500).json({ error: 'Erreur lors de l\'ajout du stock' }));
});

app.get("/stocks/:produitId", checkAuth, (req, res) => {
    const {produitId} = req.params;

    Stock.findOne({ produitId })
        .then(stock => {
            if (!stock) {
                return res.status(404).json({ error: 'Stock non trouvé' });
            }
            res.status(200).json(stock);
        })
        .catch(error => res.status(500).json({ error: error.message }));
});

app.put("/stocks/:produitId/modifier", checkAuth, (req, res) => {
    const produitId = req.params.produitId;
    const { quantite } = req.body;

    Stock.findOneAndUpdate({ produitId }, { quantite }, { new: true })
        .then(stock => {
            if (!stock) {
                return res.status(404).json({ error: 'Stock non trouvé' });
            }
            res.status(200).json(stock);
        })
        .catch(error => res.status(500).json({ error: error.message }));
});

app.delete("/stocks/:produitId/supprimer", checkAuth, (req, res) => {
    const produitId = req.params.produitId;

    Stock.findOneAndDelete({ produitId })
        .then(stock => {
            if (!stock) {
                return res.status(404).json({ error: 'Stock non trouvé' });
            }
            res.status(200).json({ message: 'Stock supprimé avec succès' });
        })
        .catch(error => res.status(500).json({ error: error.message }));
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
