const mongoose = require('mongoose');

const ImmobiliSchema = mongoose.Schema({
    indirizzo: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    tipologia: {
        type: String,
        required: true 
    },
    titolo: {
        type: String,
        required: true
    },
    descrizione: {
        type: String,
        required: true
    },
    prezzo: {
        type: Number,
        required: true
    },
    vani: {
        type: String,
        required: true
    },
    camere: {
        type: String,
        required: true
    },
    bagni: {
        type: String,
        required: true 
    },
    image: {
        type: String,
        required: true
    }
});

const Immobile = module.exports = mongoose.model('Immobile',ImmobiliSchema);