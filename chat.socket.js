var moment = require("moment");
const { insertMensaje, selectMensajes } = require("./sqlite/sqlite3");
const { ContenedorMongoDB } = require("./mongoDB/Mensaje");
const { authorSchema } = require("./mongoDB/models/Mensaje.schema");
const { normalize } = require("normalizr");

const contenedorMongo = new ContenedorMongoDB();

async function getMensajes() {
	let mensajes = await contenedorMongo.getAll();
	const MensajeNormalizado = normalize(mensajes, authorSchema);
	let ln = JSON.stringify(mensajes).length;
	let lnz = JSON.stringify(MensajeNormalizado).length;
	return { mensajes: MensajeNormalizado, comprension: (lnz * 100) / ln };
}

async function socketChat(io, socket) {
	socket.on("nuevo_mensaje", async (data) => {
		data.date = moment().toString();
		contenedorMongo.save(data);
	
		let mensajes = await contenedorMongo.getAll();
		const MensajeNormalizado = normalize(mensajes, authorSchema);

		let ln = JSON.stringify(mensajes).length;
		let lnz = JSON.stringify(MensajeNormalizado).length;

		io.sockets.emit("mensajes", {messages:MensajeNormalizado,comprension:(lnz * 100) / ln});
	});
}

module.exports = {
	getMensajes,
	socketChat,
};
