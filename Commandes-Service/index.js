const express = require('express');
const app = express();
const port = process.env.PORT || 3002;
const mongoose = require('mongoose');
const Commande = require('./Commande')
const checkAuth = require('./auth')
const axios = require('axios')

app.use(express.json());

async function getPtoduitsTotal(ids){
    const URI = 'http://localhost:3001'
    const produits = await axios.post(`${URI}/produits/acheter`, {
        ids: ids
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return produits.data
}

mongoose.connect('mongodb://127.0.0.1:27017/commandes-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.post("/commandes/ajouter", checkAuth, async (req, res) => {
    const { ids ,email_utilisateur, adress } = req.body;

    try {
        const { total, produits} = await getPtoduitsTotal(ids);
        await axios('http://localhost:3003/stock/')
        const commande = new Commande({
            produits: [...produits],
            email_utilisateur: email_utilisateur,
            prix_total: total,
            adress: adress
        });

        const savedCommande = await commande.save();
        res.status(201).json(savedCommande);
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: 'Un erreur est survenue' });
    }
})

app.delete('commandes/annuler',checkAuth,async (req,res) => {
    const {commandId} = req.body

    await Commande.deleteOne({
        _id: commandId
    })
    res.status(204)
})

app.listen(port, console.log('Server is running'))