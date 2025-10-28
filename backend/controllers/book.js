const Book = require("../models/book");

exports.createBook = (request, response, next) => {
  delete request.body._id;
  const book = new Book({
    ...request.body,
  });
  book.save()
    .then(() => response.status(201).json({ message: "Livre enregistré !" }))
    .catch(next);
};

exports.updateBook = (request, response, next) => {
  Book.updateOne({ _id: request.params.id }, {
    ...request.body,
    _id: request.params.id,
  })
    .then(() => response.status(200).json({ message: "Livre mis à jour !" }))
    .catch(next);
};

exports.deleteBook = (request, response, next) => {
  Book.deleteOne({ _id: request.params.id })
    .then(() => response.status(200).json({ message: "Livre supprimé !" }))
    .catch(next);
};

exports.getBook = (request, response, next) => {
  Book.findOne({ _id: request.params.id })
    .then((book) => response.status(200).json(book))
    .catch((error) => response.status(404).json({ error }));
};

exports.getAllBooks = (request, response, next) => {
  Book.find()
    .then((books) => response.status(200).json(books))
    .catch(next);
};
