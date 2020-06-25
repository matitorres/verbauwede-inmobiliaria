const helpers = {}

helpers.isAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('msg_error', 'Debes iniciar sesión para continuar')
    res.redirect('/admin/login')
}

helpers.isAuthenticatedInit = (req,res,next) => {
    if(req.isAuthenticated()) {
        res.redirect('/admin/properties/1')
    }
    res.redirect('/admin/login')
}

module.exports = helpers