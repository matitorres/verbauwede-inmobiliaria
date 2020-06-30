const clientCtrl = {}

const http = require('http')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS_EMAIL
    },
    tls: {
        rejectUnauthorized: false
    }
})

const Property = require('../models/Property')

const {
    mail,
    mailLink,
    facebook,
    instagram,
    whatsappNumber,
    whatsappLink,
    phone,
    phoneLink,
    enumOperation,
    enumType,
    enumOrientation,
    enumNeighborhoodType,
    enumProvince,
    enumAccess,
    enumGarageType,
    enumGarageAccess,
    enumServices,
    perPage,
    tokenBCRA } = require('../public/values')

const propertyFormValues = {
    enumOperation,
    enumType,
    enumOrientation,
    enumFeatures: [],
    enumNeighborhoodType,
    enumProvince,
    enumAccess,
    enumGarageType,
    enumGarageAccess
}

const { diacriticSensitiveRegex } = require('../helpers/libs')

let formFields
let contactFormFields
let pagination = {}
let msg = ''
const search = true
const contactData = { mail, mailLink, facebook, instagram, whatsappNumber, whatsappLink, phone, phoneLink }

clientCtrl.renderIndex = async (req, res) => {
    const featuredPropertiesCount = await Property.countDocuments({ outstanding: true }) - 3
    const featuredProperties = await Property.find({ outstanding: true }).limit(4).skip(Math.floor(Math.random() * featuredPropertiesCount))
    const latestProperties = await Property.find().sort({ createdAt: 'desc' }).limit(5)
    let customProperties
    if (req.cookies.customProperties) {
        const operation = req.cookies.customProperties.operation
        const type = req.cookies.customProperties.type
        let filterCustomProperties = setFilters({ searchOperation: operation, searchType: type })
        customProperties = await Property.find(filterCustomProperties).sort({ outstanding: 'desc' }).limit(5)

        // Agregar propiedades si faltan
        if (customProperties.length === 1) {
            let filterAux
            if (operation) {
                filterAux = { operation: operation, outstanding: true }
            } else {
                filterAux = { type: type, outstanding: true }
            }
            let auxPropertiesCount = await Property.countDocuments(filterAux)
            if (auxPropertiesCount === 0) {
                filterAux = { operation: 'Venta', outstanding: true }
                auxPropertiesCount = await Property.countDocuments(filterAux)
            }
            const auxProperties = await Property.find(filterAux).limit(2).skip(Math.floor(Math.random() * auxPropertiesCount))
            customProperties = customProperties.concat(auxProperties)
        }
    }
    res.render('index', { contactData, featuredProperties, latestProperties, propertyFormValues, customProperties })
}

clientCtrl.renderSearch = async (req, res) => {
    try {
        if (req.query.searchOperation || req.query.searchOperation === '') {
            formFields = req.query
            if (req.query.searchServices) {
                formFields.searchServicesArray = req.query.searchServices.split(',')
            }
        } else {
            formFields = req.body
            if (req.body.searchServices) {
                formFields.searchServicesArray = req.body.searchServices.split(',')
            }
        }

        formFields = validateSearchFields(formFields)
        //console.log(formFields)

        setCookiesSearch(formFields, res)

        let filters = setFilters(formFields)
        //console.log(filters)

        const page = parseInt(req.params.page) || 1
        let propertiesCount = await Property.countDocuments(filters)

        setPagination(page, propertiesCount)

        const properties = await Property.find(filters)
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({ outstanding: 'desc' })

        const featuredPropertiesCount = await Property.countDocuments({ outstanding: true }) - 1
        const featuredProperties = await Property.find({ outstanding: true }).limit(2).skip(Math.floor(Math.random() * featuredPropertiesCount))

        res.render('properties/search-properties', { contactData, search, properties, featuredProperties, pagination, propertyFormValues, formFields })

    } catch (error) {
        console.log('Error al buscar propiedad: ' + error)
    }
}

clientCtrl.renderProperty = async (req, res) => {
    const property = await Property.findById(req.params.id)
    res.render('properties/property', { contactData, property, propertyFormValues })
}

clientCtrl.sendContactForm = (req, res) => {
    contactFormFields = validateContactFields(req.body)
    console.log(contactFormFields)
    const { operation, type, address, city, province, name, email, phone, message, error } = contactFormFields
    if (error) {
        msg = 'Valores del formulario fuera de rango. No introduzca caracteres especiales como: " # $ % & / ( ) = | ° > < [ ] { }'
        req.flash('client_msg_error', msg)
        res.redirect('/')
    } else {
        if (email !== '' && phone !== '') {
            let contentHTML
            let mailOptions
            if (operation) {
                contentHTML = `
                    <h3>Información de contacto</h3>
                    <ul>
                        <li>Nombre y apellido: ${name}</li>
                        <li>Correo electrónico: ${email}</li>
                        <li>Teléfono: ${phone}</li>
                    </ul>
                    <h3>Información de la propiedad</h3>
                    <ul>
                        <li>Operación: ${operation}</li>
                        <li>Tipo de propiedad: ${type}</li>
                        <li>Dirección: ${address}</li>
                        <li>Localidad: ${city}</li>
                        <li>Provincia: ${province}</li>
                    </ul>
                `

                mailOptions = {
                    from: email,
                    to: mail,
                    subject: `DUEÑO: Consulta de ${name} desde la web`,
                    html: contentHTML
                }
            } else {
                contentHTML = `
                    <h3>Información de contacto</h3>
                    <ul>
                        <li>Nombre y apellido: ${name}</li>
                        <li>Correo electrónico: ${email}</li>
                        <li>Teléfono: ${phone}</li>
                    </ul>
                    <h3>Mensaje</h3>
                    <p>${message}</p>
                `

                mailOptions = {
                    from: email,
                    to: mail,
                    subject: `CLIENTE: Consulta de ${name} desde la web`,
                    html: contentHTML
                }
            }

            transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    //console.log(err)
                    msg = 'Ha ocurrido un error al intentar enviar la consulta. Por favor vuelva a intentarlo.'
                    req.flash('client_msg_error', msg)
                    res.redirect('/')
                } else {
                    //console.log(data)
                    msg = '¡Muchas gracias por contactarse con nosotros! Nos comunicaremos con Ud. a la brevedad.'
                    req.flash('client_msg_success', msg)
                    res.redirect('/')
                }
            })
        } else {
            msg = 'Los campos \"Correo electrónico\" y \"Teléfono\" son obligatorios. Vuelva a intentarlo'
            req.flash('client_msg_error', msg)
            res.redirect('/')
        }
    }
}

const setPagination = (page, propertiesCount) => {
    if (propertiesCount > perPage) {
        pagination.visible = true
    } else {
        pagination.visible = false
    }
    let pages = []
    const pagesCount = Math.ceil(propertiesCount / perPage)
    for (let i = 0; i < pagesCount; i++) {
        pages.push(i + 1)
    }
    pagination.pages = pages
    pagination.current = page
    pagination.currentFirst = (page === 1) ? true : false
    if (page === pagesCount || pagesCount === 1) {
        pagination.currentLast = true
    } else {
        pagination.currentLast = false
    }
    pagination.next = (page === pagesCount) ? 1 : page + 1
    pagination.prev = (page === 1) ? 1 : page - 1
}

const validateSearchFields = (fields) => {
    let error = false
    const patternLetters = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g
    const patternNumbers = /^[0-9]+$/

    if (fields.searchOperation && fields.searchOperation !== '') {
        if (enumOperation.indexOf(fields.searchOperation) < 0) {
            fields.searchOperation = ''
            error = true
        }
    }
    if (fields.searchType && fields.searchType !== '') {
        if (enumType.indexOf(fields.searchType) < 0) {
            fields.searchType = ''
            error = true
        }
    }
    if (fields.searchCity && fields.searchCity !== '') {
        if (fields.searchCity.length > 50 || !patternLetters.test(fields.searchCity)) {
            fields.searchCity = ''
            error = true
        }
    }
    if (fields.searchProvince && fields.searchProvince !== '') {
        if (enumProvince.indexOf(fields.searchProvince) < 0) {
            fields.searchProvince = ''
            error = true
        }
    }
    if (fields.searchBedrooms && fields.searchBedrooms !== '') {
        const values = ['1', '2', '3', '4', '1+', '2+', '3+', '4+', '5+']
        if (values.indexOf(fields.searchBedrooms) < 0) {
            fields.searchBedrooms = ''
            error = true
        }
    }
    if (fields.searchPriceMin && fields.searchPriceMin !== '') {
        if (!patternNumbers.test(fields.searchPriceMin)) {
            fields.searchPriceMin = ''
            error = true
        }
    }
    if (fields.searchPriceMax && fields.searchPriceMax !== '') {
        if (!patternNumbers.test(fields.searchPriceMax)) {
            fields.searchPriceMax = ''
            error = true
        }
    }
    if ((fields.searchPriceMax && fields.searchPriceMax !== '') && (fields.searchPriceMin && fields.searchPriceMin !== '')) {
        if (parseInt(fields.searchPriceMax) <= parseInt(fields.searchPriceMin)) {
            fields.searchPriceMax = ''
            fields.searchPriceMin = ''
            error = true
        }
    }
    if (fields.searchAreaMin && fields.searchAreaMin !== '') {
        if (!patternNumbers.test(fields.searchAreaMin)) {
            fields.searchAreaMin = ''
            error = true
        }
    }
    if (fields.searchAreaMax && fields.searchAreaMax !== '') {
        if (!patternNumbers.test(fields.searchAreaMax)) {
            fields.searchAreaMax = ''
            error = true
        }
    }
    if (fields.searchAreaMin && fields.searchAreaMin !== '' && fields.searchAreaMax && fields.searchAreaMax !== '') {
        if (parseInt(fields.searchAreaMin) >= parseInt(fields.searchAreaMax)) {
            fields.searchAreaMin = ''
            fields.searchAreaMax = ''
            error = true
        }
    }
    if (fields.searchServicesArray && fields.searchServicesArray !== '') {
        fields.searchServicesArray.forEach(element => {
            if (enumServices.indexOf(element) < 0) {
                error = true
            }
        });
        if (error) {
            fields.searchServicesArray = ''
        }
    }
    if (fields.searchNeighborhood && fields.searchNeighborhood !== '') {
        if (enumNeighborhoodType.indexOf(fields.searchNeighborhood) < 0) {
            fields.searchNeighborhood = ''
            error = true
        }
    }
    if (fields.searchExpenses && fields.searchExpenses !== '') {
        const values = ['Con expensas', 'Sin expensas']
        if (values.indexOf(fields.searchExpenses) < 0) {
            fields.searchExpenses = ''
            error = true
        }
    }

    if (error) {
        fields.error = true
    }

    return fields
}

const validateContactFields = (fields) => {
    let error = false
    const patternLetters = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/
    const patternMessage = /[0-9A-Za-zÁÉÍÓÚáéíóúñÑ .,;:?¿!¡]+$/
    const patternAddress = /^[0-9A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/
    const patternNumbers = /^[0-9]+$/
    const patternMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/

    if (fields.operation && fields.operation !== '') {
        if (enumOperation.indexOf(fields.operation) < 0) {
            fields.operation = ''
            error = true
        }
    }

    if (fields.type && fields.type !== '') {
        if (enumType.indexOf(fields.type) < 0) {
            fields.type = ''
            error = true
        }
    }

    if (fields.province && fields.province !== '') {
        if (enumProvince.indexOf(fields.province) < 0) {
            fields.province = ''
            error = true
        }
    }

    if (fields.address && fields.address !== '') {
        if (fields.address.length > 50 || !patternAddress.test(fields.address)) {
            fields.address = ''
            error = true
        }
    }

    if (fields.city && fields.city !== '') {
        if (fields.city.length > 50 || !patternLetters.test(fields.city)) {
            fields.city = ''
            error = true
        }
    }

    if (fields.name && fields.name !== '') {
        if (fields.name.length > 50 || !patternLetters.test(fields.name)) {
            fields.name = ''
            error = true
        }
    }

    if (fields.mail && fields.mail !== '') {
        if (fields.mail.length > 50 || !patternMail.test(fields.mailname)) {
            fields.mail = ''
            error = true
        }
    }

    if (fields.phone && fields.phone !== '') {
        if (!patternNumbers.test(fields.phone)) {
            fields.phone = ''
            error = true
        }
    }

    if (fields.message && fields.message !== '') {
        if (fields.message.length > 150 || !patternMessage.test(fields.message)) {
            fields.message = ''
            error = true
        }
    }

    if (error) {
        fields.error = true
    }

    return fields
}

const setFilters = fields => {
    const {
        searchOperation,
        searchType,
        searchCity,
        searchProvince,
        searchBedrooms,
        searchPriceMin,
        searchPriceMax,
        searchIsDollar,
        searchAreaMin,
        searchAreaMax,
        searchIsHectare,
        searchIsCoveredArea,
        searchServices,
        searchServicesArray,
        searchNeighborhood,
        searchExpenses } = fields

    let filters = {
        $and: []
    }

    if (searchOperation) {
        if (searchOperation !== '') {
            filters.$and.push({ operation: searchOperation })
        }
    }

    if (searchType) {
        if (searchType !== '') {
            let type
            if (searchType === 'Casa') {

                type = ['Casa', 'Dúplex - PH', 'Cabaña']

            } else if (searchType === 'Hotel - Complejo turístico') {

                type = ['Hotel - Complejo turístico', 'Cabaña']

            } else if (searchType === 'Departamento') {

                type = ['Departamento', 'Monoambiente']

            } else {

                type = [searchType]

            }
            filters.$and.push({ type: { $in: type } })
        }
    }

    if (searchCity) {
        if (searchCity !== '') {
            filters.$and.push({ city: { $regex: '.*' + diacriticSensitiveRegex(searchCity) + '.*', $options: 'i' } })
        }
    }

    if (searchProvince) {
        if (searchProvince !== '') {
            filters.$and.push({ province: searchProvince })
        }
    }

    if (searchBedrooms) {
        if (searchBedrooms !== '') {
            if (searchBedrooms.indexOf('+') < 0) {
                filters.$and.push({ bedrooms: parseInt(searchBedrooms) })
            } else {
                filters.$and.push({ bedrooms: { $gte: parseInt(searchBedrooms) } })
            }
        }
    }

    if (searchPriceMin || searchPriceMax) {
        if (searchPriceMin !== '' || searchPriceMax !== '') {
            var isDollar = (searchIsDollar === 'true')
            if (isDollar) {
                if (searchPriceMin !== '' && searchPriceMax === '') {
                    filters.$and.push({
                        $and: [
                            { price: { $gte: parseInt(searchPriceMin) } },
                            { dollar: true },
                        ]
                    })
                }
                if (searchPriceMin === '' && searchPriceMax !== '') {
                    filters.$and.push({
                        $and: [
                            { price: { $lte: parseInt(searchPriceMax) } },
                            { dollar: true },
                        ]
                    })
                }
                if (searchPriceMin !== '' && searchPriceMax !== '') {
                    filters.$and.push({
                        $and: [
                            { price: { $gte: parseInt(searchPriceMin) } },
                            { price: { $lte: parseInt(searchPriceMax) } },
                            { dollar: true }
                        ]
                    })
                }
            } else {
                if (searchPriceMin !== '' && searchPriceMax === '') {
                    filters.$and.push({
                        $and: [
                            { price: { $gte: parseInt(searchPriceMin) } },
                            { dollar: false },
                        ]
                    })
                }
                if (searchPriceMin === '' && searchPriceMax !== '') {
                    filters.$and.push({
                        $and: [
                            { price: { $lte: parseInt(searchPriceMax) } },
                            { dollar: false },
                        ]
                    })
                }
                if (searchPriceMin !== '' && searchPriceMax !== '') {
                    filters.$and.push({
                        $and: [
                            { price: { $gte: parseInt(searchPriceMin) } },
                            { price: { $lte: parseInt(searchPriceMax) } },
                            { dollar: false }
                        ]
                    })
                }
            }
        }
    }

    if (searchAreaMin || searchAreaMax) {
        if (searchAreaMin !== '' || searchAreaMax !== '') {
            const isHectare = (searchIsHectare === 'true')
            const isCoveredArea = (searchIsCoveredArea === 'true')
            if (isCoveredArea) {
                if (searchAreaMin !== '' && searchAreaMax === '') {
                    filters.$and.push({
                        $and: [
                            { coveredArea: { $gte: parseInt(searchPriceMin) } },
                            { hectare: isHectare },
                        ]
                    })
                }
                if (searchAreaMin === '' && searchAreaMax !== '') {
                    filters.$and.push({
                        $and: [
                            { coveredArea: { $lte: parseInt(searchAreaMax) } },
                            { hectare: isHectare },
                        ]
                    })
                }
                if (searchAreaMin !== '' && searchAreaMax !== '') {
                    filters.$and.push({
                        $and: [
                            { coveredArea: { $gte: parseInt(searchAreaMin) } },
                            { coveredArea: { $lte: parseInt(searchAreaMax) } },
                            { hectare: isHectare }
                        ]
                    })
                }
            } else {
                if (searchAreaMin !== '' && searchAreaMax === '') {
                    filters.$and.push({
                        $and: [
                            { totalArea: { $gte: parseInt(searchAreaMin) } },
                            { hectare: isHectare },
                        ]
                    })
                }
                if (searchAreaMin === '' && searchAreaMax !== '') {
                    console.log('2')
                    filters.$and.push({
                        $and: [
                            { totalArea: { $lte: parseInt(searchAreaMax) } },
                            { hectare: isHectare },
                        ]
                    })
                }
                if (searchAreaMin !== '' && searchAreaMax !== '') {
                    console.log('3')
                    filters.$and.push({
                        $and: [
                            { totalArea: { $gte: parseInt(searchAreaMin) } },
                            { totalArea: { $lte: parseInt(searchAreaMax) } },
                            { hectare: isHectare }
                        ]
                    })
                }
            }
        }
    }

    if (searchServices) {
        if (searchServices !== '') {
            filters.$and.push({ features: { $all: searchServicesArray } })
        }
    }

    if (searchNeighborhood) {
        if (searchNeighborhood !== '') {
            filters.$and.push({ neighborhoodType: searchNeighborhood })
        }
    }

    if (searchExpenses) {
        if (searchExpenses !== '') {
            if (searchExpenses === 'Con expensas') {
                filters.$and.push({ features: 'Expensas' })
            } else {
                filters.$and.push({ features: { $nin: 'Expensas' } })
            }
        }
    }

    if (filters.$and.length === 0) {
        filters = {}
    }

    return filters

}

const setCookiesSearch = (formFields, res) => {
    let customPropertiesCookie = {}
    if (formFields.searchOperation && formFields.searchOperation !== '') {
        customPropertiesCookie.operation = formFields.searchOperation
    }
    if (formFields.searchType && formFields.searchType !== '') {
        customPropertiesCookie.type = formFields.searchType
    }
    if (customPropertiesCookie.operation || customPropertiesCookie.type) {
        res.cookie('customProperties', customPropertiesCookie, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        })
    }
}

module.exports = clientCtrl