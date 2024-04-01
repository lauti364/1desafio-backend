const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            if (data) {
                this.products = JSON.parse(data);
            } else {
                this.products = [];
            }
        } catch (error) {
            console.error('Error al cargar los productos:', error.message);
            this.products = [];
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar los productos:', error.message);
        }
    }

    addProduct(product) {
        if (!this.isProductValid(product)) {
            console.log("Error: El producto no es válido");
            return;
        }

        if (this.isCodeDuplicate(product.code)) {
            console.log("Error: El código del producto ya está en uso");
            return;
        }

        product.id = this.getNextId();
        this.products.push(product);
        this.saveProducts();
        console.log("Producto agregado con éxito.");
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((p) => p.id === id);
        if (product) {
            return product;
        } else {
            console.log("Error: Producto no encontrado");
            return null;
        }
    }

    updateProduct(id, newData) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...newData };
            this.saveProducts();
            console.log("Producto actualizado con éxito.");
        } else {
            console.error("Error: Producto no encontrado.");
        }
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            this.saveProducts();
            console.log("Producto eliminado con éxito.");
        } else {
            console.error("Error: Producto no encontrado.");
        }
    }

    isProductValid(product) {
        return (
            product.title &&
            product.description &&
            product.price &&
            product.thumbnail &&
            product.code &&
            product.stock !== undefined
        );
    }

    isCodeDuplicate(code) {
        return this.products.some((p) => p.code === code);
    }

    getNextId() {
        const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0);
        return maxId + 1;
    }
}

const productManager = new ProductManager('productos.json');

// Agregar productos
productManager.addProduct({
    title: "Agua",
    description: "bebida saludable",
    price: 100.00,
    thumbnail: "../imagenes/agua.avif",
    code: "01",
    stock: 10
});
productManager.addProduct({
    title: "Coca",
    description: "gaseosa",
    price: 200.00,
    thumbnail: "../imagenes/coca.jpg",
    code: "02",
    stock: 20
});

// Obtener productos por ID
const product2 = productManager.getProductById(2);
const product = productManager.getProductById(1);

// Mostrar los productos encontrados
console.log("Producto encontrado:", product);
console.log("Producto 2 encontrado:", product2);

// Actualizar producto
productManager.updateProduct(1, { price: 150 });

// Eliminar producto
productManager.deleteProduct(2);
