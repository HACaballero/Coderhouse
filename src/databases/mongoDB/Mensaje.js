const { Mensaje } = require("./models/Mensaje.schema");
class ContenedorMongoDB {
	entity;

	constructor(model) {
		this.entity = Mensaje;
	}

	async save(item) {
		try {
			const newItem = new this.entity(item);
			return await newItem.save();
		} catch (e) {
			console.log(`Error al guardar el elemento: ${e}`);
		}
	}
	async getById(id) {
		try {
			return await this.entity.find({ id });
		} catch (e) {
			console.log(`Error al obtener los datos: ${e}`);
		}
	}
	async getAll() {
		try {
			return await this.entity.find({});
		} catch (e) {
			console.log(`Error al obtener los datos: ${e}`);
		}
	}
	async deleteById(id) {
		try {
			await this.entity.deleteOne({ id });
		} catch (e) {
			console.log(`Error al borrar el dato: ${e}`);
		}
	}
	async update(id, body) {
		try {
			return await this.entity.updateOne({ id }, { $set: body });
		} catch (e) {
			console.log(`Error al actualizar el item : ${e}`);
		}
	}
}

module.exports = {
	ContenedorMongoDB,
};
