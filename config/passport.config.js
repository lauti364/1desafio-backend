const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const userService = require('../dao/models/usuarios.model.js');
const { createHash, isValidPassword } = require('../utils.js');

const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID: " Iv23lidNVeCVp9cbIiEk",
        clientSecret: "1ebbee88fa84cca38dd647e805e5e2c8dcad6224",
        callbackURL: "http://localhost:8080/api/session/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await userService.findOne({ email: profile._json.email });
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 20,
                    email: profile._json.email,
                    password: ""
                };
                let result = await userService.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id);
        done(null, user);
    });

}

module.exports = initializePassport;
