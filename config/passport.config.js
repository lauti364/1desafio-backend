const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const userService = require('../dao/models/usuarios.model.js');
const { createHash, isValidPassword } = require('../utils.js');

const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID: "Iv23lidNVeCVp9cbIiEk",
        clientSecret: "e79b5370f24d9aea4c38fc6b24cb2f1d51188804",
        callbackURL: "http://localhost:8080/api/session/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            let user = await userService.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 20,
                    email: profile._json.email,
                    password: ""
                }
                let result = await userService.create(newUser)
                done(null, result)
            }
            else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await userService.findOne({ email });

            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }

            const isValid = await isValidPassword(password, user.password);

            if (!isValid) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            return done(null, user);

        } catch (error) {
            return done(error);
        }
    }));

    // Serialización de usuario para sesiones
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // Deserialización de usuario para sesiones
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userService.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};


module.exports = initializePassport;