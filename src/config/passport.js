const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/User')

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {

    // Match User's email
    const user = await User.findOne({email})
    if (!user) {
        return done(null, false, { message: 'Los datos ingresados son incorrectos' })
    } else {
        // Match User's password
        const matchPass = await user.matchPass(password)
        if (matchPass) {
            return done(null, user)
        } else {
            return done(null, false, { message: 'Los datos ingresados son incorrectos' })
        }
    }

}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})