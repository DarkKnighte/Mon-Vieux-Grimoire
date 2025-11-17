const jwt = require("jsonwebtoken"); // Importation de la bibliothèque jsonwebtoken pour gérer les tokens JWT

// Exportation d'une fonction middleware qui prend les paramètres request, response et next
module.exports = (request, response, next) => {
  try {
    // Affiche l'en-tête d'autorisation dans la console
    console.log("Header Authorization :", request.headers.authorization);

    // Récupération du token à partir de l'en-tête d'autorisation
    const token = request.headers.authorization.split(" ")[1];

    // Vérification du token et décodage pour obtenir les informations de l'utilisateur
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");

    // Extraction de l'ID utilisateur du token décodé
    const userId = decodedToken.userId;

    // Ajout de l'ID utilisateur à l'objet request pour un accès ultérieur
    request.auth = { userId };

    // Appel de la fonction next() pour passer au middleware suivant
    next();
  } catch (error) {
    // En cas d'erreur d'authentification, affiche l'erreur dans la console
    console.error("Erreur d'authentification :", error.message);

    // Envoi d'une réponse 401 (non autorisé) avec l'erreur
    response.status(401).json({ error });
  }
};
