const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema({

    slug: {
        type: String
    },
    titolo: {
        type: String,
        required: true
    },
    descrizione: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    data:{
        type: Date,
        default: Date.now
    }
});

const News = module.exports = mongoose.model('News',NewsSchema);