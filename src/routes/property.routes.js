const { Router } = require('express')
const router = Router()

const { 
    renderPropertiesList,
    renderAddPropertyForm,
    addProperty,
    renderUpdatePropertyForm,
    updateProperty,
    deleteProperty,
    searchProperties,
    renderUpdatePropertyPhotosForm,
    updatePropertyPhotos
} = require('../controllers/property.controller')

const { isAuthenticated } = require('../helpers/auth')

router.get('/admin/properties/:page', isAuthenticated, renderPropertiesList)

router.get('/admin/properties/search/:page', isAuthenticated, searchProperties)

router.post('/admin/properties/search/:page', isAuthenticated, searchProperties)

router.get('/admin/properties/add/:type', isAuthenticated, renderAddPropertyForm)

router.post('/admin/properties/add', isAuthenticated, addProperty)

router.get('/admin/properties/update/:id', isAuthenticated, renderUpdatePropertyForm)

router.get('/admin/properties/updatePhotos/:id', isAuthenticated, renderUpdatePropertyPhotosForm)

router.put('/admin/properties/update/:id', isAuthenticated, updateProperty)

router.put('/admin/properties/updatePhotos/:id', isAuthenticated, updatePropertyPhotos)

router.delete('/admin/properties/delete/:id', isAuthenticated, deleteProperty)

module.exports = router