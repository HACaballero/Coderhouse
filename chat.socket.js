var moment = require("moment");
const { insertMensaje, selectMensajes } = require("./sqlite/sqlite3");
const { ContenedorMongoDB } = require("./mongoDB/Mensaje");
const { authorSchema } = require("./mongoDB/models/Mensaje.schema");
const { normalize } = require("normalizr");
const inspect = require("./utils/inspect");

const contenedorMongo = new ContenedorMongoDB();
let mensajes = [
	{
		email: "test@gmail.com",
		date: "12/2/2022 20:32:21",
		mensaje: "Hola",
	},
];
async function getMensajes() {
	let mensajes = await contenedorMongo.getAll();
	const MensajeNormalizado = normalize(mensajes, authorSchema);
	//console.log(MensajeNormalizado);
	//inspect(MensajeNormalizado);
	let ln = JSON.stringify(mensajes).length;
	let lnz = JSON.stringify(MensajeNormalizado).length;
	console.log("COMPRESION Normalizada ----->", (lnz * 100) / ln);

	return { mensajes: MensajeNormalizado, comprension: (lnz * 100) / ln };
}

async function socketChat(io, socket) {
	socket.on("nuevo_mensaje", async (data) => {
		data.date = moment().toString();
		console.log("NUEVO MENSAJE", data);
		contenedorMongo.save(data);
	
		let mensajes = await contenedorMongo.getAll();
		const MensajeNormalizado = normalize(mensajes, authorSchema);
		//console.log(MensajeNormalizado);
		//inspect(MensajeNormalizado);
		let ln = JSON.stringify(mensajes).length;
		let lnz = JSON.stringify(MensajeNormalizado).length;
		console.log("COMPRESION Normalizada ----->", (lnz * 100) / ln);

		io.sockets.emit("mensajes", {messages:MensajeNormalizado,comprension:(lnz * 100) / ln});
	});
}

module.exports = {
	getMensajes,
	socketChat,
};
