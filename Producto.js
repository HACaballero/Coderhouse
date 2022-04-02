class Contenedor {
	constructor(nameFile) {
		this.nameFile = nameFile;
		this.productos = [
			{
				title: "Escuadra",
				price: 123,
				id: 1,
				image: 'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-512.png'
			},
		];
	}
	async save(item) {
		try {
			let newId = this.productos.length + 1;
			item.id = newId;
			this.productos.push(item);
			return this.productos;
		} catch (e) {
			console.log(`Erroral guardar el producto: ${e}`);
		}
	}
	async getById(id) {
		try {
			let filter = this.productos.filter((i) => i.id == id);
			return filter;
		} catch (e) {
			console.log(`Error al obtener el elemento : ${e}`);
		}
	}
	async getAll() {
		try {
			return this.productos;
		} catch (e) {
			console.log(`Error al obtener los datos : ${e}`);
		}
	}
	async deleteById(id) {
		try {
			let filter = this.productos.filter((i) => i.id != id);
			this.productos = filter;
		} catch (e) {
			console.log(`Error al borrar el elemento : ${e}`);
		}
	}
	async update(id, body) {
		try {
			let index = this.productos.findIndex((x) => x.id == id);
			if (index != -1) {
				let item = this.productos[index];
				item.price = body.price;
				item.title = body.title;
				this.productos[index] = item;
				return item;
			} else {
				return {};
			}
		} catch (e) {
			console.log(`Error al actualizar el producto : ${e}`);
		}
	}
}

module.exports = Contenedor;
