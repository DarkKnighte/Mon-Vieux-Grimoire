const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
	try {
    console.log("Header Authorization :", request.headers.authorization);
		const token = request.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
		const userId = decodedToken.userId;
		request.auth = { userId };
		next();
	} catch (error) {
    console.error("Erreur d'authentification :", error.message);
		response.status(401).json({ error });
	}
};
