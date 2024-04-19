const mongoose = require("mongoose")

const CommandeSchema = mongoose.Schema({
    produits: {
        type: [String],
    },
    email_utilisateur: String,
    prix_total: Number,
    adress: String,
    created_at: {
        type: Date,
        default: Date.now(),
    }
})

module.exports = Commande = mongoose.model('commande', CommandeSchema)