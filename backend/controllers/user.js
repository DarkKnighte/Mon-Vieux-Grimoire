// Importation du module bcrypt pour le hachage des mots de passe
const bcrypt = require("bcrypt");
// Importation du module jsonwebtoken pour créer des tokens d'authentification
const jwt = require("jsonwebtoken");

// Importation du modèle User pour interagir avec la base de données
const User = require("../models/user");

// Fonction d'inscription d'un nouvel utilisateur
exports.signUp = (request, response, next) => {
  // Hachage du mot de passe avec un salt de 10 rounds
  bcrypt
    .hash(request.body.password, 10)
    .then((hash) => {
      // Création d'une nouvelle instance de User avec l'email et le mot de passe haché
      const user = new User({
        email: request.body.email,
        password: hash,
      });
      // Sauvegarde de l'utilisateur dans la base de données
      user
        .save()
        // Réponse de succès avec le code 201 (Created)
        .then(() => response.status(201).json({ message: "Utilisateur créé !" }))
        // Gestion des erreurs lors de la sauvegarde
        .catch(next);
    })
    // Gestion des erreurs lors du hachage avec le code 500 (Internal Server Error)
    .catch((error) => response.status(500).json({ error }));
};

// Fonction de connexion d'un utilisateur existant
exports.login = (request, response, _next) => {
  // Recherche d'un utilisateur par son email dans la base de données
  User.findOne({ email: request.body.email })
    .then((user) => {
      // Si aucun utilisateur n'est trouvé
      if (user === null) {
        // Réponse d'erreur avec le code 401 (Unauthorized)
        response.status(401).json({ message: "Utlisateur non trouvé" });
      } else {
        // Comparaison du mot de passe fourni avec le mot de passe haché stocké
        bcrypt
          .compare(request.body.password, user.password)
          .then((valid) => {
            // Si le mot de passe est incorrect
            if (!valid) {
              // Réponse d'erreur avec le code 401 (Unauthorized)
              response.status(401).json({ message: "Mot de passe incorrect" });
            } else {
              // Si le mot de passe est correct, génération d'un token JWT et envoi de la réponse
              response.status(200).json({
                // Création d'un token JWT avec l'ID de l'utilisateur, valide pendant 24h
                token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                  expiresIn: "24h",
                }),
                // Envoi de l'ID de l'utilisateur
                userId: user._id,
              });
            }
          })
          // Gestion des erreurs lors de la comparaison avec le code 500
          .catch((error) => {
            response.status(500).json({ error });
          });
      }
    })
    // Gestion des erreurs lors de la recherche avec le code 500
    .catch((error) => response.status(500).json({ error }));
};
