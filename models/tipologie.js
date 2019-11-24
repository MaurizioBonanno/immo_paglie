
const mongoose = require('mongoose');

const TipologiaSchema = mongoose.Schema({

    tipologia: {
        type: String,
        required: true 
    }
});

const tipologie = module.exports = mongoose.model('tipologie',TipologiaSchema);