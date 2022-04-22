const express = require("express");
var bodyParser = require("body-parser");
const { engine } = require("express-handlebars");

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const { getMensajes, socketChat } = require("./Modules/Mensajes/chat.socket");
let cors = require("cors");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const { router, ioObject } = require("./routes.js");
const { createProductosTable } = require("./mariaDB/createTable");
const { selectProductos } = require("./mariaDB/mariaDB");
const { createMensajesTable } = require("./sqlite/createMensajesTable");
const { getMockProductos } = require("./mock/productos.mock");
const { session } = require("./utils/session");
require("dotenv").config();
var argv = require("minimist")(process.argv.slice(2));

const PORT = argv.PORT || 8080;
//Routes
const { authRouter } = require("./Modules/Auth/auth.routes");
const { envRouter } = require("./Modules/Env_Info/env_info.routes");

app.use(cors("*"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(session); // Session

const { connect } = require("./mongoDB/connect");
connect();

const dirname = __dirname.replace("src", "");
console.log(dirname);
app.engine(
	"handlebars",
	engine({
		layoutsDir: dirname + "/views/layouts",
		partialsDir: dirname + "/views/partials/",
	})
);
console.log("URL", __dirname + "/views/layouts");
app.set("view engine", "handlebars");
app.use("/api/productos", router);
app.use("/auth", authRouter);
app.use("/info", envRouter);

createProductosTable();
createMensajesTable();

app.get("/", async (req, res) => {
	if (!req.session.email) {
		res.redirect("/auth/login");
	}
	productos = await selectProductos();
	productos = JSON.parse(JSON.stringify(productos));
	let { mensajes, comprension } = await getMensajes();
	res.render("main", {
		layout: "index",
		list: productos,
		session: req.session.email ? true : false,
		user: req.session.email,
		mensajes: mensajes,
		comprension: comprension,
		empty: productos.length == 0 ? true : false,
	});
});

app.get("/register", async (req, res) => {
	res.render("register", {
		layout: "index",
	});
});

app.get("/logout", async (req, res) => {
	let user = req.session.email;
	req.session.destroy((err) => {
		if (err) {
			return res.json({ status: "Logout ERROR", body: err });
		}
	});
	res.render("logout", {
		layout: "index",
		user,
	});
});

app.get("/productos", async (req, res) => {
	productos = await selectProductos().then((productos) => {
		return productos;
	});
	productos = JSON.parse(JSON.stringify(productos));
	res.render("main", {
		layout: "index",
		list: encodeURIComponent(JSON.stringify(productos)),
		empty: productos.length == 0 ? true : false,
	});
});

app.get("/productos-test", async (req, res) => {
	productos = await getMockProductos(5);
	productos = JSON.parse(JSON.stringify(productos));
	let { mensajes, comprension } = await getMensajes();

	res.render("main", {
		layout: "index",
		list: productos,
		mensajes: mensajes,
		comprension: comprension,
		empty: productos.length == 0 ? true : false,
	});
});
httpServer.listen(PORT, () => console.log("SERVER ON"));

io.on("connection", (socket) => {
	socketChat(io, socket);
});

ioObject(io);