const Book = require("../models/book");
const fs = require("node:fs");

exports.createBook = (request, response, next) => {
	console.log("Création du livre à partir de la requête:", request.body);
	const bookObject = JSON.parse(request.body.book);
	delete bookObject._id;
	delete bookObject._userId;

	const book = new Book({
		...bookObject,
		image: `${request.protocol}://${request.get("host")}/images/${request.file.filename}`,
		userId: request.auth.userId,
	});

	console.log("Sauvegarde du livre:", book);

	book
		.save()
		.then(() => response.status(201).json({ message: "Livre créé !" }))
		.catch(next);
};

exports.updateBook = (request, response, next) => {
	const bookObject = request.file
		? {
				...JSON.parse(request.body.book),
				image: `${request.protocol}://${request.get("host")}/images/${request.file.filename}`,
			}
		: { ...request.body };

	delete bookObject._userId;
	Book.findOne({ _id: request.params.id })
		.then((book) => {
			if (book.userId !== request.auth.userId) {
				response.status(401).json({ message: "Non-autorisé" });
			} else {
				Book.updateOne({ _id: request.params.id }, { ...bookObject, _id: request.params.id })
					.then(() => response.status(200).json({ message: "Livre modifié !" }))
					.catch(next);
			}
		})
		.catch(next);
};

exports.deleteBook = (request, response, next) => {
	Book.findOne({ _id: request.params.id })
		.then((book) => {
			if (book.userId !== request.auth.userId) {
				response.status(401).json({ message: "Non-autorisé" });
			} else {
				const filename = book.image.split("/images/")[1];
				fs.unlink(`images/${filename}`, () => {
					Book.deleteOne({ _id: request.params.id })
						.then(() => response.status(200).json({ message: "Livre supprimé !" }))
						.catch(next);
				});
			}
		})
		.catch((error) => response.status(500).json({ error }));
};

exports.getBook = (request, response, _next) => {
	Book.findOne({ _id: request.params.id })
		.then((book) => response.status(200).json(book))
		.catch((error) => response.status(404).json({ error }));
};

exports.getAllBooks = (_request, response, next) => {
	Book.find()
		.then((books) => response.status(200).json(books))
		.catch(next);
};
