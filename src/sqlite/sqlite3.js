const sqlite_knex = require("knex")({
	client: "sqlite3",
	connection: { filename: "DB/ecommerce.db" },
	useNullAsDefault: true,
	pool: { min: 0, max: 7 },
});
function insertMensaje(mensaje) {
	sqlite_knex("mensajes")
		.insert(mensaje)
		.then(() => console.log("Mensaje agregado"))
		.catch((err) => console.log("Error", err));
}

async function selectMensajes() {
	return await sqlite_knex("mensajes")
		.select("*")
		.then((rows) => {
			return rows;
		})
		.catch((err) => console.log("Error", err));
}
module.exports = {
	insertMensaje,
	selectMensajes,
};
