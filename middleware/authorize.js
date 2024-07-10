const authorizeRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.session.user && req.session.user.rol;

        if (userRole && roles.includes(userRole)) {
            next(); 
        } else {
            res.status(403).json({ message: 'No tienes permisos para realizar esta acción.' });
        }
    };
};

module.exports = authorizeRole;
