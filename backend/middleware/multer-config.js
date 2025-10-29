const multer = require("multer");

const MIME_TYPES = {
	"image/jpeg": "jpg",
	"image/jpg": "jpg",
	"image/png": "png",
};

const storage = multer.diskStorage({
	destination: (_request, _file, callback) => callback(null, "images"),
	filename: (_request, file, callback) => {
		const name = file.originalname.split(" ").join("_");
		const extension = MIME_TYPES[file.mimetype];
		callback(null, `${name + Date.now()}.${extension}`);
	},
});

module.exports = multer({ storage }).single("image");
