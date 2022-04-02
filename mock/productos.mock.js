const { faker } = require('@faker-js/faker');

function getMockProductos(cant) {
	let items = [];

	for (let i = 0; i < cant; i++) {
		fakeData = {
			id: faker.datatype.number(),
			title: faker.commerce.product(),
			image: faker.image.abstract(),
			price: faker.finance.amount(),
		};
		items.push(fakeData);
	}
	return items;
}

module.exports = {
	getMockProductos,
};
