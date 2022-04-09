const express = require("express");
var bodyParser = require("body-parser");
const { engine } = require("express-handlebars");

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const { getMensajes, socketChat } = require("./chat.socket");
let cors = require("cors");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const { router, ioObject } = require("./routes.js");
const { createProductosTable } = require("./mariaDB/createTable");
const { selectProductos } = require("./mariaDB/mariaDB");
const { createMensajesTable } = require("./sqlite/createMensajesTable");
const { getMockProductos } = require("./mock/productos.mock");
app.use(cors("*"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

//Session
var session = require("express-session");
const MongoStore = require("connect-mongo");
const advancedOptions = {useNewUrlParser:true, useUnifiedTopology:true}
app.use(
	session({
		store: MongoStore.create({ mongoUrl: "mongodb+srv://ACaballero:afotNbT5cDOvGazW@cluster0.rkbgt.mongodb.net/sesiones?retryWrites=true&w=majority",mongoOptions:advancedOptions }),
		secret: "secretDB",
		resave: false,
		saveUninitialized: false,

		cookie: {
			expires: 600000,
		},
	})
);
const { connect } = require("./mongoDB/connect");
connect();
app.engine(
	"handlebars",
	engine({
		layoutsDir: __dirname + "/views/layouts",
		partialsDir: __dirname + "/views/partials/",
	})
);
app.set("view engine", "handlebars");
app.use("/api/productos", router);

createProductosTable();
createMensajesTable();

app.get("/", async (req, res) => {
	if (!req.session.username) {
		res.redirect("/login");
	}
	console.log(`Visitó la pag ${req.session.contador} veces.`);
	productos = await selectProductos();
	productos = JSON.parse(JSON.stringify(productos));
	let { mensajes, comprension } = await getMensajes();
	res.render("main", {
		layout: "index",
		list: productos,
		session: req.session.username ? true : false,
		user: req.session.username,
		mensajes: mensajes,
		comprension: comprension,
		empty: productos.length == 0 ? true : false,
	});
});

app.get("/login", async (req, res) => {
	if (req.session.username) {
		res.redirect("/");
	}
	productos = await selectProductos();
	productos = JSON.parse(JSON.stringify(productos));
	let { mensajes, comprension } = await getMensajes();
	res.render("login", {
		layout: "index",
		list: productos,
		mensajes: mensajes,
		comprension: comprension,
		empty: productos.length == 0 ? true : false,
	});
});

app.get("/logout", async (req, res) => {
	let user = req.session.username;
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

app.post("/login", async (req, res) => {
	if (req.body.username) {
		req.session.username = req.body.username;
	}
	res.redirect("/");
});

httpServer.listen(8080, () => console.log("SERVER ON"));

io.on("connection", (socket) => {
	socketChat(io, socket);
});

ioObject(io);
