const express = require("express");
const mongoose = require("mongoose");

const Book = require("./models/books");

const app = express();

app.use(express.json());

app.post("/api/books", (request, response, next) => {
    delete request.body._id;
    const book = new Book({
        ...request.body
    });
    book.save()
    .then(() => response.status(201).json({ message: 'Livre enregistré !' }))
    .catch(error => response.status(400).json({ error }));
});

app.get("/api/books/:id", (request, response, next) => {
    Book.findOne({ _id: request.params.id })
    .then(book => response.status(200).json(book))
    .catch(error => response.status(404).json({ error }));
});

app.get("/api/books", (request, response, next) => {
    Book.find()
    .then(books => response.status(200).json(books))
    .catch(error => response.status(400).json({ error }));
});

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});

mongoose.connect('',)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
