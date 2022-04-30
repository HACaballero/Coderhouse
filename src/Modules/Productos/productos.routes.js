const express = require("express");
const { insertProducto, selectProductos } = require("./mariaDB/mariaDB.js");
const { Router } = express;
const Producto = require("./Modules/Productos/Producto.js");
let producto = new Producto("./productos.txt");

const router = new Router();

ioObject = (socket) => {
	console.log("io");

	//"connection" se ejecuta la primera vez que se abre una nueva conexión

	router.get("/", (req, res) => {
		producto.getAll().then((productos) => {
			res.send({ productos });
		});
	});
	router.get("/:id", (req, res) => {
		producto.getById(req.params.id).then((productos) => {
			if (productos.length > 0) {
				res.send({ productos });
			} else {
				res.send({ error: "producto no encontrado" });
			}
		});
	});

	router.post("/", async (req, res) => {
		await insertProducto(req.body);
		let productos = await selectProductos();
		socket.emit("init", productos);
		res.redirect("/");
	});
	router.delete("/:id", (req, res) => {
		producto.deleteById(req.params.id).then(() => {
			res.send({ message: "Elemento eliminado" });
		});
	});
	router.put("/:id", (req, res) => {
		producto.update(req.params.id, req.body).then((item) => {
			res.send(item);
		});
	});
};

module.exports = {
	producto,
	router,
	ioObject,
};
