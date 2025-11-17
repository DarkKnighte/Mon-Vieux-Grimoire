const sharp = require("sharp");
const fs = require("fs");

module.exports = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const filePath = req.file.path;
    const optimizedPath = filePath.replace(/(\.\w+)$/, "-optimized$1");

    await sharp(filePath)
      .jpeg({ quality: 60 })        // Compression à ~60% (modifiable)
      .toFile(optimizedPath);

    fs.unlinkSync(filePath);        // On supprime le fichier original

    req.file.path = optimizedPath;  // On remplace le chemin par le fichier optimisé
    req.file.filename = req.file.filename.replace(/(\.\w+)$/, "-optimized$1");

    next();

  } catch (error) {
    console.error("Erreur optimisation image :", error);
    next();
  }
};
