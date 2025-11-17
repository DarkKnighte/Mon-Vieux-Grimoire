const Book = require("../models/book");
const fs = require("node:fs");

// 📖 Création d'un nouveau livre
exports.createBook = (request, response, next) => {
  console.log("Création du livre à partir de la requête:", request.body);
  // Parse l'objet livre depuis le formulaire multipart
  const bookObject = JSON.parse(request.body.book);
  // Supprime les champs sensibles envoyés par le client
  delete bookObject._id;
  delete bookObject._userId;

  // Crée une nouvelle instance de livre avec les données validées
  const book = new Book({
    ...bookObject,
    // Génère l'URL complète de l'image uploadée
    imageUrl: `${request.protocol}://${request.get("host")}/images/${request.file.filename}`,
    // Associe le livre à l'utilisateur authentifié
    userId: request.auth.userId,
  });

  console.log("Sauvegarde du livre:", book);

  // Enregistre le livre dans la base de données
  book
    .save()
    .then(() => response.status(201).json({ message: "Livre créé !" }))
    .catch(next);
};

// ✏️ Modification d'un livre existant
exports.updateBook = (request, response, next) => {
  // Si une nouvelle image est uploadée, met à jour l'URL, sinon utilise les données du body
  const bookObject = request.file
    ? {
        ...JSON.parse(request.body.book),
        imageUrl: `${request.protocol}://${request.get("host")}/images/${request.file.filename}`,
      }
    : { ...request.body };

  // Supprime le userId pour éviter toute modification malveillante
  delete bookObject._userId;

  // Recherche le livre à modifier
  Book.findOne({ _id: request.params.id })
    .then((book) => {
      // Vérifie que l'utilisateur est bien le créateur du livre
      if (book.userId !== request.auth.userId) {
        response.status(401).json({ message: "Non-autorisé" });
      } else {
        // Met à jour le livre dans la base de données
        Book.updateOne({ _id: request.params.id }, { ...bookObject, _id: request.params.id })
          .then(() => response.status(200).json({ message: "Livre modifié !" }))
          .catch(next);
      }
    })
    .catch(next);
};

// 🗑️ Suppression d'un livre
exports.deleteBook = (request, response, next) => {
  // Recherche le livre à supprimer
  Book.findOne({ _id: request.params.id })
    .then((book) => {
      // Vérifie que l'utilisateur est bien le créateur du livre
      if (book.userId !== request.auth.userId) {
        response.status(401).json({ message: "Non-autorisé" });
      } else {
        // Extrait le nom du fichier image depuis l'URL
        const filename = book.imageUrl.split("/images/")[1];
        // Supprime le fichier image du serveur
        fs.unlink(`images/${filename}`, () => {
          // Supprime le livre de la base de données
          Book.deleteOne({ _id: request.params.id })
            .then(() => response.status(200).json({ message: "Livre supprimé !" }))
            .catch(next);
        });
      }
    })
    .catch((error) => response.status(500).json({ error }));
};

// 📚 Récupération d'un livre spécifique par son ID
exports.getBook = (request, response, _next) => {
  Book.findOne({ _id: request.params.id })
    .then((book) => response.status(200).json(book))
    .catch((error) => response.status(404).json({ error }));
};

// 📚 Récupération de tous les livres
exports.getAllBooks = (_request, response, next) => {
  Book.find()
    .then((books) => response.status(200).json(books))
    .catch(next);
};

// 🏆 Récupération des 3 livres les mieux notés
exports.getBestRatedBooks = (_request, response, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Tri décroissant par note moyenne
    .limit(3) // Limite à 3 résultats
    .then((books) => response.status(200).json(books))
    .catch(next);
};

// ⭐ Attribution d'une note à un livre
exports.rateBook = (request, response, next) => {
  const userId = request.auth.userId;
  const grade = request.body.rating;

  // Valide que la note est entre 0 et 5
  if (grade < 0 || grade > 5) {
    return response.status(400).json({ message: "La note doit être comprise entre 0 et 5." });
  }

  // Recherche le livre à noter
  Book.findOne({ _id: request.params.id })
    .then((book) => {
      if (!book) return response.status(404).json({ message: "Livre non trouvé" });

      // Vérifie si l'utilisateur a déjà noté ce livre
      const existingRating = book.ratings.find((r) => r.userId === userId);
      if (existingRating) {
        return response.status(400).json({ message: "Vous avez déjà noté ce livre." });
      }

      // Ajoute la nouvelle note au tableau des notes
      book.ratings.push({ grade, userId });

      // Recalcule la moyenne des notes
      const total = book.ratings.reduce((accumulator, current) => accumulator + current.grade, 0);
      book.averageRating = total / book.ratings.length;

      // Sauvegarde le livre avec la nouvelle note et moyenne
      book
        .save()
        .then((updatedBook) => response.status(200).json(updatedBook))
        .catch(next);
    })
    .catch(next);
};
