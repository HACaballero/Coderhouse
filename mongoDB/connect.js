const mongoose = require('mongoose');
const config = require("../config/config");
const { mongo_config: env } = config;

const connect = () => {
	console.log("CONNECT");
	if (mongoose.connection.readyState == 0) {
		mongoose
			.connect(env.url)
			.then((res) => {
				console.log("Base de datos conectada");
			})
			.catch((e) => {
				console.log("Error al conectar la base", e);
			});
	}
};

module.exports = {
	connect,
};
