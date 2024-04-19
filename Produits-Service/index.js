const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const mongoose = require('mongoose');
const Produit = require('./Produit');
const checkAuth = require('./auth')

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/produits-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.post("/produits/ajouter",checkAuth, (req, res) => {
    const { nom, description, prix, stock } = req.body;
    const newProduit = new Produit({
        nom,
        description,
        prix,
        stock
    })
    newProduit.save()
        .then(produit => res.status(201).json(produit))
        .catch(() => res.json('Produits not added successfully.'))
})

app.get("/produits", checkAuth, (req, res) => {
    Produit.find()
        .then(produits => res.status(201).json(produits))
        .catch(error => res.status(400).json({ error }));
});

app.post('/produits/acheter',async (req, res) => {
    const {ids} = req.body
    const produits = await Produit.find({
        _id: {$in: ids},
        stock : {$gt: 0}
    })
    await Produit.updateMany({
            _id: {$in: ids}
       }, {
            $inc: {stock: -1}
       }
    )

    const total = produits.reduce((acc,produit) => acc + produit.prix, 0)

    res.status(200).json({
        produits: produits,
        total: total
    })
})

app.put('/produits/modifier',checkAuth, async (req,res) => {
    const {_id, nom, description, prix, stock} = req.body;

    const produit = await Produit.findOneAndUpdate(
        {_id: _id},
        {
            nom: nom,
            description: description,
            prix: prix,
            stock: stock
        }
    )

    if (!produit) return res.status(404).json({error: "Produit non trouvé"})

    res.json(produit)
})

app.delete('/produits/supprimer', checkAuth,async (req, res) => {
    const { _id} = req.body

    const deleted = await Produit.findOneAndDelete({_id: _id})

    if (!deleted) return res.status(404).json({error: "Produit non trouvé"})
    res.json({message: "Produit supprimé"})
})

app.listen(port, () => console.log(`Server is running`))