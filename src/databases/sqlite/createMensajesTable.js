const sqlite_knex = require("knex")({
	client: "sqlite3",
	connection: { filename: "./DB/ecommerce.db" },
	useNullAsDefault: true,
	pool: { min: 0, max: 7 },
});

async function createMensajesTable() {
	try {
		let existeTabla = await sqlite_knex.schema.hasTable("mensajes");
		if (!existeTabla) {
			await sqlite_knex.schema.createTable("mensajes", (table) => {
				table.increments("id").primary(),
					table.string("email"),
					table.string("date"),
					table.float("mensaje");
			});
		} else {
			console.log("Tabla mensajes ya existe");
		}
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	createMensajesTable,
};
