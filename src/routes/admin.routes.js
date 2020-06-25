const { Router } = require('express')
const router = Router()

const { 
    renderSignupForm, 
    signup, 
    renderLoginForm, 
    login, 
    logout, 
    renderUsers, 
    deleteUser 
} = require('../controllers/admin.controller')

const { isAuthenticated, isAuthenticatedInit } = require('../helpers/auth')

router.get('/admin', isAuthenticatedInit, renderSignupForm)

router.get('/admin/signup', isAuthenticated, renderSignupForm)

router.post('/admin/signup', isAuthenticated, signup)

router.get('/admin/login', renderLoginForm)

router.post('/admin/login', login)

router.get('/admin/logout', isAuthenticated, logout)

router.get('/admin/users', isAuthenticated, renderUsers)

router.delete('/admin/users/:user_id', isAuthenticated, deleteUser)

module.exports = router