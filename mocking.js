const { faker } = require('@faker-js/faker');



function generateMockProducts(count = 100) {
    const products = [];
    for (let i = 0; i < count; i++) {
        products.push({
            nombre: faker.commerce.productName(),
            precio: faker.commerce.price(),
            descripcion: faker.commerce.productDescription(),
            stock: faker.datatype.number({ min: 1, max: 100 }),
        });
    }
    return products;
}


module.exports = { generateMockProducts };
