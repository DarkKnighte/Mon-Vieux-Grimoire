const mongoose = require('mongoose')

const booksSchema = mongoose.Schema({
    title: { type: String, required: true},
    author: { type: String, required: true},
    year: { type: Number, required: true},
    gender: { type: String, required: true},
    note: { type: Number, required: true},
    image: { type: String, required: true},
});

module.exports = mongoose.model('Book', booksSchema);
