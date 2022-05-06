const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const { socketChat } = require("./Modules/Mensajes/chat.socket");
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
app.use(compression);
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
	const { commonRouter } = require("./commons.routes");

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
	app.use("/", commonRouter);
	app.use("/api/productos", router);
	app.use("/auth", authRouter);
	app.use("/info", envRouter);

	httpServer.listen(PORT, () => console.log("SERVER ON"));

	io.on("connection", (socket) => {
		socketChat(io, socket);
	});

	ioObject(io);
}
