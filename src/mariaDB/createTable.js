const { options } = require("./options.js");
const db_knex = require("knex")(options);

async function createProductosTable() {
	try {
		let existeTabla = await db_knex.schema.hasTable("productos");
		if (!existeTabla) {
			await db_knex.schema.createTable("productos", (table) => {
				table.increments("id").primary(),
					table.string("title"),
					table.string("image"),
					table.float("price");
			});
		} else {
			console.log("Esta tabla ya existe");
		}
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	createProductosTable,
};
