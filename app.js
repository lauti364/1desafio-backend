class Product {
    constructor(id, codigo, nombre, precio) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.precio = precio;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
        this.nextId = 1;
    }

    addProduct(codigo, nombre, precio) {
        if (!codigo || !nombre || !precio) {
            console.error("Todos los campos son obligatorios.");
            return;
        }

        const existingProduct = this.products.find(product => product.codigo === codigo);
        if (existingProduct) {
            console.error("Ya existe un producto con ese código.");
            return;
        }

        const newProduct = new Product(this.nextId, codigo, nombre, precio);
        this.products.push(newProduct);
        this.nextId++;
        console.log("Producto agregado con éxito.");
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado.");
            return null;
        }
    }

    getProducts() {
        return this.products;
    }
}

const productManager = new ProductManager();



//productos
productManager.addProduct("01", "agua", 100.00);
productManager.addProduct("02", "coca", 500.00);

//llama a los prodcutos x id
const product2 = productManager.getProductById(2);
const product = productManager.getProductById(1);

//muestra las caracteristicas
console.log("Producto encontrado:", product);
console.log("Producto 2 encontrado:", product2);


//prueba de error
productManager.getProductById(3);
