const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

const app = express();

app.use(morgan("dev"));
app.use(helmet());

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static("images"));

app.use((error, _request, response, _next) => {
	console.error("Une erreur est survenue.", error);
	response.status(400).json({ error: error.message });
});

app.listen(4000, "127.0.0.1", () => {
	console.log("Server running on http://127.0.0.1:4000");
});

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));
