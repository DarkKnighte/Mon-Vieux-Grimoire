const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signUp = (request, response, next) => {
	bcrypt
		.hash(request.body.password, 10)
		.then((hash) => {
			const user = new User({
				email: request.body.email,
				password: hash,
			});
			user
				.save()
				.then(() => response.status(201).json({ message: "Utilisateur créé !" }))
				.catch(next);
		})
		.catch((error) => response.status(500).json({ error }));
};

exports.login = (request, response, _next) => {
	User.findOne({ email: request.body.email })
		.then((user) => {
			if (user === null) {
				response.status(401).json({ message: "Utlisateur non trouvé" });
			} else {
				bcrypt
					.compare(request.body.password, user.password)
					.then((valid) => {
						if (!valid) {
							response.status(401).json({ message: "Mot de passe incorrect" });
						} else {
							response.status(200).json({
								token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
									expiresIn: "24h",
								}),
								userId: user._id,
							});
						}
					})
					.catch((error) => {
						response.status(500).json({ error });
					});
			}
		})
		.catch((error) => response.status(500).json({ error }));
};
