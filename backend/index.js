const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

app.post("/api/books", (request, response, next) => {
  console.log(request.body);
  response.status(201).json({ message: "Book created" });
  next();
})

app.get("/api/books", (request, response, next) => {
  console.log(request.body);
  response.status(200).json({ message: "Books retrieved" });
  next();
});

app.get("/api/books", (request, response, next) => {
    response.json({ message: "Hello World" });
});

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});

mongoose.connect('mongodb+srv://gabrielgambotti_db_user:<Gabrielito11.>@darkknight.rm2llp8.mongodb.net/?retryWrites=true&w=majority&appName=DarkKnight',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
