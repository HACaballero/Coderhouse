const { options } = require("./options.js");
const knex = require("knex")(options);

function insertProducto(producto) {
	knex("productos")
		.insert(producto)
		.then(() => console.log("Producto agregado"))
		.catch((err) => console.log("Error", err));
}

async function selectProductos() {
	console.log("SELECT PRODUCTOS");
	return await knex("productos")
		.select("*")
		.then((rows) => {
			return rows;
		})
		.catch((err) => console.log("Error", err));
}
module.exports = {
	insertProducto,
	selectProductos,
};
