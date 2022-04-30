const express = require("express");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const { getMensajes, socketChat } = require("./Modules/Mensajes/chat.socket");
const cors = require("cors");
const { router, ioObject } = require("./routes.js");
const { createProductosTable } = require("./databases/mariaDB/createTable");
const {
	createMensajesTable,
} = require("./databases/sqlite/createMensajesTable");
const { selectProductos } = require("./databases/mariaDB/mariaDB");
const { getMockProductos } = require("./Modules/Productos/productos.mock");
const { connect } = require("./databases/mongoDB/connect");

const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
//Init
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
require("dotenv").config();
app.use(cors("*"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (cluster.isMaster) {
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	cluster.on("exit", (worker, code, signal) => {
		console.log("Worker died");
	});
} else {
	//Maria DB
	createProductosTable();
	createMensajesTable();

	//MongoDB connect
	connect();

	//Args
	var argv = require("minimist")(process.argv.slice(2));
	const PORT = argv.PORT || 8080;

	//Session
	const { session } = require("./utils/session");

	//Routes
	const { authRouter } = require("./Modules/Auth/auth.routes");
	const { envRouter } = require("./Modules/Env_Info/env_info.routes");

	app.use(session); // Session

	//Handlebars
	app.use(express.static("public"));
	const dirname = __dirname.replace("src", "");
	app.engine(
		"handlebars",
		engine({
			layoutsDir: dirname + "/views/layouts",
			partialsDir: dirname + "/views/partials/",
		})
	);
	app.set("view engine", "handlebars");

	//Routes
	app.use("/api/productos", router);
	app.use("/auth", authRouter);
	app.use("/info", envRouter);

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
}
