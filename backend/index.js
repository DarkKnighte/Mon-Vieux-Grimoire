// Importation des modules nécessaires
const express = require("express"); // Framework web pour Node.js
const mongoose = require("mongoose"); // ODM pour MongoDB
const morgan = require("morgan"); // Middleware pour le logging des requêtes
const helmet = require("helmet"); // Middleware pour la sécurité des applications
require("dotenv").config(); // Charge les variables d'environnement depuis un fichier .env

// Importation des routes
const bookRoutes = require("./routes/book"); // Routes pour les livres
const userRoutes = require("./routes/user"); // Routes pour les utilisateurs

// Création de l'application Express
const app = express();

// Utilisation de morgan pour le logging des requêtes en mode développement
app.use(morgan("dev"));

// Configuration de helmet pour la sécurité
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Désactive la politique de ressources croisées
  }),
);

// Middleware pour gérer les CORS (Cross-Origin Resource Sharing)
app.use((_request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*"); // Autorise toutes les origines
  response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"); // Autorise certains en-têtes
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS"); // Autorise certaines méthodes HTTP
  next(); // Passe au middleware suivant
});

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Utilisation des routes pour les livres et les utilisateurs
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static("images")); // Sert les fichiers statiques depuis le dossier "images"

// Middleware pour gérer les erreurs
app.use((error, _request, response, _next) => {
  console.error("Une erreur est survenue.", error); // Log l'erreur dans la console
  response.status(400).json({ error: error.message }); // Renvoie une réponse JSON avec le message d'erreur
});

// Démarrage du serveur sur le port 4000
app.listen(4000, "127.0.0.1", () => {
  console.log("Server running on http://127.0.0.1:4000"); // Affiche un message dans la console
});

// Connexion à la base de données MongoDB
mongoose
  .connect(process.env.MONGO_URL) // Utilise l'URL de connexion depuis les variables d'environnement
  .then(() => console.log("Connexion à MongoDB réussie !")) // Affiche un message de succès
  .catch(() => console.log("Connexion à MongoDB échouée !")); // Affiche un message d'erreur
