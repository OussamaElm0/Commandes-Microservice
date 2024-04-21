const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    produitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'produits',
        required: true
    },
    quantite: {
        type: Number,
        required: true,
    },
    last_update: {
        type: Date,
        default: Date.now(),
    }
})

module.exports = Stock = mongoose.model('Stock', StockSchema)