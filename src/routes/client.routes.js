const { Router } = require('express')
const router = Router()

const { renderIndex, renderSearch, renderProperty, sendContactForm } = require('../controllers/client.controller')

router.get('/', renderIndex)

router.post('/send_contact_form', sendContactForm)

router.get('/search/:page', renderSearch)

router.post('/search/:page', renderSearch)

router.get('/property/:id', renderProperty)

module.exports = router