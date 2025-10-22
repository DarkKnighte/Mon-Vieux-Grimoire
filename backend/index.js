const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const bookRoutes = require("./routes/book");

const app = express();

app.use(express.json());

app.use("/api/books", bookRoutes);

app.use((error, request, response, next) => {
  console.error("Une erreur est survenue.", error);
  response.status(400).json({ error: error.message });
});

app.listen(4000, "127.0.0.1", () => {
  console.log("Server running on http://127.0.0.1:4000");
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
