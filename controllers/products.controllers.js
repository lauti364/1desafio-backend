const Producto = require('../dao/models/products.model'); 

const getAllProducts = async (req, res) => {
    try {
        let { limit = 10, page = 1, sort = '', query = '' } = req.query;

        limit = parseInt(limit);
        page = parseInt(page);

        const filter = query ? { nombre: new RegExp(query, 'i') } : {};
        const sortField = sort || '_id';

        const totalDocuments = await Producto.countDocuments(filter);
        const totalPages = Math.ceil(totalDocuments / limit);

        const productos = await Producto.find(filter)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort(sortField)
            .lean();

        const response = {
            products: productos,
            totalPages: totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page: page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
            nextLink: page < totalPages ? `/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null
        };

        res.render('products', response);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findById(id);
        res.render('product-details', { producto });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
};

const createProduct = async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);
        const { nombre, precio, descripcion, stock } = req.body;

        // Buscar el producto por su nombre
        const existingProduct = await Producto.findOne({ nombre });

        // Si existe, eliminar el producto existente
        if (existingProduct) {
            await Producto.findByIdAndDelete(existingProduct._id);
            console.log(`Producto "${nombre}" existente eliminado.`);
            return res.status(200).send('Producto eliminado correctamente');
        }

        // Si no existe, crear el nuevo producto
        const nuevoProducto = new Producto({ nombre, precio, descripcion, stock });
        await nuevoProducto.save();
        
        res.status(200).send('Producto agregado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
};