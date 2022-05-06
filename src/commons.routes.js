const express = require("express");
const { Router } = express;
const commonRouter = new Router();
const { getMensajes, socketChat } = require("./Modules/Mensajes/chat.socket");

commonRouter.get("/", async (req, res) => {
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

commonRouter.get("/productos", async (req, res) => {
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

commonRouter.get("/productos-test", async (req, res) => {
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

module.exports = { commonRouter };

