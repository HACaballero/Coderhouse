const express = require("express");
const { Router } = express;
const { ContenedorUser } = require("./../../databases/mongoDB/User");


const authRouter = new Router();
const userContainer = new ContenedorUser();

authRouter.get("/register", async (req, res) => {
	res.render("register", {
		layout: "index",
	});
});

authRouter.get("/login", async (req, res) => {
	res.render("login", {
		layout: "index",
	});
});
authRouter.post("/register", async (req, res) => {
	await userContainer.save(req.body);
	res.redirect("/");
});

authRouter.post("/login", async (req, res) => {
	const { auth, message } = await userContainer.login(req.body);
	console.log("AUTH", auth);
	if (auth) {
		req.session.email = req.body.email;
		res.redirect("/");
	} else {
		res.send({auth, message });
	}
});

module.exports = { authRouter };
