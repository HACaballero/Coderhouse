const { User } = require("./models/User.schema");
const bcrypt = require("bcrypt");
class ContenedorUser {
	entity;

	constructor(model) {
		this.entity = User;
	}

	async save(item) {
		try {
			let salt = await bcrypt.genSalt();
			let password = await bcrypt.hash(item.password, salt);
			const user = { email: item.email, password, salt };
			const newItem = new this.entity(user);
			return await newItem.save();
		} catch (e) {
			console.log(`Error al guardar el elemento: ${e}`);
		}
	}
	async login({ email, password }) {
		try {
			const user = await this.entity.findOne({ email });
			if (user) {
				const hash = await bcrypt.hash(password, user.salt);
				if (hash == user.password) {
					return { auth: true, message: "ok" };
				} else {
					return { auth: false, message: "Contraseña incorrecta" };
				}
			}
			return { auth: false, message: "No existe el usuario" };
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
	ContenedorUser,
};
