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

authRouter.get("/logout", async (req, res) => {
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

module.exports = { authRouter };
