const express = require("express");
const mongoose = require("mongoose");

const bookRoutes = require("./routes/book");

const app = express();

app.use(express.json());

app.use("/api/books", bookRoutes);

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});
