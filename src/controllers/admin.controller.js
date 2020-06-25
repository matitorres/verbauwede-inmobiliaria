const adminCtrl = {}

const admin = true

const passport = require('passport')

const User = require('../models/User')

adminCtrl.renderSignupForm = (req, res) => {
    res.render('users/signup', { admin })
}

adminCtrl.signup = async (req, res) => {
    errors = []
    const { email, password, confirm_password } = req.body
    // Validate match passwords
    if (password != confirm_password) {
        errors.push({ text: 'Las contraseñas deben coincidir' })
    }
    // Validate email exists
    const emailUser = await User.findOne({ email: email })
    if (emailUser) {
        errors.push({ text: 'Ya existe un usuario con ese correo electrónico' })
    }
    // Validate errors
    if (errors.length > 0) {
        res.render('users/signup', { errors, email, admin })
    } else {
        const newUser = new User({ email, password })
        newUser.password = await newUser.hashPass(password)
        await newUser.save()
        req.flash('msg_success', 'Usuario registrado con éxito')
        res.redirect('/admin/users')
    }
}

adminCtrl.renderLoginForm = (req, res) => {
    res.render('users/login', { admin })
}

adminCtrl.login = passport.authenticate('local', {
    failureRedirect: '/admin/login',
    successRedirect: '/admin/properties/1',
    failureFlash: true
})

adminCtrl.logout = (req, res) => {
    req.logout()
    res.redirect('/admin/login')
}

adminCtrl.renderUsers = async (req, res) => {
    const users = await User.find()
    res.render('users/users', { users, admin })
}

adminCtrl.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.user_id)
    req.flash('msg_success', 'Usuario eliminado con éxito')
    res.redirect('/admin/users')
}

module.exports = adminCtrl