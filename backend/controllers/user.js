const bcrypt = require("bcrypt");

const User = require("../models/user");

exports.signUp = (request, response, next) => {
  bcrypt.hash(request.body.password, 10)
    .then(hash => {
      const user = new User({
        email: request.body.email,
        password: hash
      });
      user.save()
        .then(() => response.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => response.status(400).json({ error }));
    })
    .catch((error) => response.status(500).json({ error }));
}

exports.login = (request, response, next) => {

}
