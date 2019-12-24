const mongoose = require('mongoose');

const utentiSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const News = module.exports = mongoose.model('Utenti',utentiSchema);