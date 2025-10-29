const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helpet");
require("dotenv").config();

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

const app = express();

app.use(morgan("dev"));
app.use(helmet({}));

/*
 https://www.npmjs.com/package/helmet

 Helmet sets the following headers by default:

 Content-Security-Policy: A powerful allow-list of what can happen on your page which mitigates many attacks
 Cross-Origin-Opener-Policy: Helps process-isolate your page
 Cross-Origin-Resource-Policy: Blocks others from loading your resources cross-origin
 Origin-Agent-Cluster: Changes process isolation to be origin-based
 Referrer-Policy: Controls the Referer header
 Strict-Transport-Security: Tells browsers to prefer HTTPS
 X-Content-Type-Options: Avoids MIME sniffing
 X-DNS-Prefetch-Control: Controls DNS prefetching
 X-Download-Options: Forces downloads to be saved (Internet Explorer only)
 X-Frame-Options: Legacy header that mitigates clickjacking attacks
 X-Permitted-Cross-Domain-Policies: Controls cross-domain behavior for Adobe products, like Acrobat
 X-Powered-By: Info about the web server. Removed because it could be used in simple attacks
 X-XSS-Protection: Legacy header that tries to mitigate XSS attacks, but makes things worse, so Helmet disables it
 */

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
