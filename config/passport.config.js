
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userService = require('../dao/models/usuarios.model.js');
const { isValidPassword } = require('../utils.js');
const GitHubStrategy = require('passport-github').Strategy;

const initializePassport = () => {
    passport.use(new LocalStrategy(
        { usernameField: 'email' },        async (email, password, done) => {
            try {
                let user = await userService.findOne({ email: email });
                if (!user) {
                    return done(null, false, { message: 'Correo electrónico incorrecto.' });
                }
                if (!isValidPassword(user, password)) {
                    return done(null, false, { message: 'Contraseña incorrecta.' });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
    passport.use(new GitHubStrategy({
        clientID: "Iv23lidNVeCVp9cbIiEk",
        clientSecret: "1ebbee88fa84cca38dd647e805e5e2c8dcad6224",
        callbackURL: 'http://localhost:8080/api/session/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ githubId: profile.id });

            if (user) {
                return done(null, user);
            } else {
                //crea el usuario con los datos de git
                const newUser = new User({
                    githubId: profile.id,
                    email: profile.emails[0].value, 
                   
                });

                await newUser.save();
                return done(null, newUser);
            }
        } catch (error) {
            return done(error);
        }
    }));


    passport.serializeUser((user, done) => {
        done(null, user.id); // Serialize el usuario guardando solo el id en la sesión
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userService.findById(id);
            done(null, user); // Deserialize usando el id para obtener el usuario completo
        } catch (error) {
            done(error);
        }
    });
};

module.exports = initializePassport;
