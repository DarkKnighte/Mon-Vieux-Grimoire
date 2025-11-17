// Importation de Mongoose pour gérer la base de données MongoDB
const mongoose = require("mongoose");

// Définition du schéma pour les livres
const booksSchema = mongoose.Schema({
  // Auteur du livre (obligatoire, type texte)
  author: { required: true, type: String },
  // Note moyenne du livre (obligatoire, type nombre)
  averageRating: { required: true, type: Number },
  // Genre du livre (obligatoire, type texte)
  genre: { required: true, type: String },
  // URL de l'image de couverture (obligatoire, type texte)
  imageUrl: { required: true, type: String },
  // Tableau des évaluations du livre
  ratings: {
    type: [
      {
        // Note donnée par l'utilisateur (obligatoire, type nombre)
        grade: {
          required: true,
          type: Number,
        },
        // Identifiant de l'utilisateur qui a noté (obligatoire, type texte)
        userId: {
          required: true,
          type: String,
        },
      },
    ],
  },
  // Titre du livre (obligatoire, type texte)
  title: { required: true, type: String },
  // Identifiant de l'utilisateur qui a créé le livre (obligatoire, type texte)
  userId: { required: true, type: String },
  // Année de publication (obligatoire, type nombre)
  year: { required: true, type: Number },
});

// Export du modèle "Book" basé sur le schéma défini
module.exports = mongoose.model("Book", booksSchema);
