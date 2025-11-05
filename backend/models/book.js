const mongoose = require("mongoose");

const booksSchema = mongoose.Schema({
	author: { required: true, type: String },
	averageRating: { required: true, type: Number },
	genre: { required: true, type: String },
	imageUrl: { required: true, type: String },
	ratings: {
		type: [
			{
				grade: {
					required: true,
					type: Number,
				},
				userId: {
					required: true,
					type: String,
				},
			},
		],
	},
	title: { required: true, type: String },
	userId: { required: true, type: String },
	year: { required: true, type: Number },
});

module.exports = mongoose.model("Book", booksSchema);
