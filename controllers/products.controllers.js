const Producto = require('../dao/models/products.model'); 
const { CustomError, ERROR_productos, ERROR_products,  } = require('../util/errores');
const logger = require('../util/logger.js');
const nodemailer = require('nodemailer');
const user = require('../dao/models/usuarios.model.js')
const multer = require('multer');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'lautivp16@gmail.com',  
        pass: 'nutw zcqi wneu yscg'         
    }, tls: {
        rejectUnauthorized: false
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/products/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });


const getAllProducts = async (req, res) => {
    try {
        let  { limit = 10, page = 1, sort = '', query = '', description = '' } = req.query;

        limit = parseInt(limit);
        page = parseInt(page);

        const filter = {
            ...(query ? { nombre: new RegExp(query, 'i') } : {}),
            ...(description ? { descripcion: new RegExp(description, 'i') } : {}) 
        };
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
            nextLink: page < totalPages ? `/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            user: req.session.user
        };

        // Verifica si el encabezado 'Accept' es 'application/json'
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            // Responde con JSON para las pruebas y API
            res.json(response);
        } else {
            // Renderiza la vista para las solicitudes HTML
            res.render('products', response);
        }
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

const createProduct = async (req, res, next) => {
    try {
        logger.info('Datos recibidos:', req.body);
 
        const { nombre, precio, descripcion, stock } = req.body;
        //se asegura que el admin complete todo
        if (!nombre || !precio || !descripcion || !stock) {
            throw new CustomError(ERROR_products.no_se_puede_crear,);
        }

        //si ya eexiste el producto lo busca y lo borra
        const existingProduct = await Producto.findOne({ nombre });
        if (existingProduct) {
            const ownerEmail = existingProduct.owner;

            if (ownerEmail) {
                const mailOptions = {
                    from: 'tu_correo@gmail.com',
                    to: ownerEmail,
                    subject: 'Tu producto ha sido eliminado',
                    text: `Hola, el producto "${existingProduct.nombre}" ha sido eliminado de la web.`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        logger.error(`Error al enviar correo al propietario del producto: ${error}`);
                    } else {
                        logger.info(`Correo enviado al propietario del producto: ${info.response}`);
                    }
                });
            }

            await Producto.findByIdAndDelete(existingProduct._id);
            logger.info(`Producto "${nombre}" existente eliminado.`);
            return res.status(200).send('Producto eliminado correctamente');
        }
        const fotoUrl = req.file ? `/products/${req.file.filename}` : '';


        //si no hay otro igual lo crea
        const nuevoProducto = new Producto({ nombre, precio, descripcion, stock, owner: req.session.user.email,foto: fotoUrl });
        await nuevoProducto.save();

        res.status(201).send('Producto agregado correctamente');
    } catch (error) {
        if (error instanceof CustomError) {
            return next(error);
        }

        console.error(error);
        next(new CustomError(ERROR_products.no_se_puede_crear, 'Error al crear el producto'));
    }
};


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
};