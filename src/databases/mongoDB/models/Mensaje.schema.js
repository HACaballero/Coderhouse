const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let authorSchema = new Schema({
	id: {
		type: String,
	},
	nombre: {
		type: String,
	},
	email: {
		type: String,
	},
	apellido: {
		type: String,
	},
	edad: {
		type: Number,
	},
	alias: {
		type: String,
	},
	avatar: {
		type: String,
	},
});
const Author = mongoose.model("Author", authorSchema);

let mensajeSchema = new Schema({
	author: { type: authorSchema },

	texto: {
		type: String,
	},
});

const Mensaje = mongoose.model("Mensaje", mensajeSchema);

module.exports = {
	Mensaje,
	authorSchema
};
