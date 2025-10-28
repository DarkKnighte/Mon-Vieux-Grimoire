const express = require("express");
const router = express.Router();

const bookCtrl = require("../controllers/controllers");

router.post("/", bookCtrl.createBook);
router.put("/:id", bookCtrl.updateBook);
router.delete("/:id", bookCtrl.deleteBook);
router.get("/:id", bookCtrl.getBook);
router.get("/", bookCtrl.getAllBooks);

module.exports = router;
