const propertyCtrl = {}

const {
    bucket,
    s3BasePath,
    enumOperation,
    enumType,
    enumOrientation,
    enumFeaturesCasa,
    enumFeaturesCampo,
    enumFeaturesCochera,
    enumFeaturesNegocio,
    enumFeaturesOtros,
    enumNeighborhoodType,
    enumProvince,
    enumAccess,
    enumGarageType,
    enumGarageAccess,
    perPage } = require('../public/values')
const { diacriticSensitiveRegex } = require('../helpers/libs')

const AWS = require('aws-sdk')
const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
})
const path = require('path')
const sharp = require('sharp')
const fs = require('fs-extra')
const Property = require('../models/Property')

let propertyForm
let formFields = { type: '' }
let pagination = {}
const admin = true
const propertiesList = true
const edit = true
const search = true
const map = true
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

propertyCtrl.renderPropertiesList = async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1
        const propertiesCount = await Property.countDocuments()
        setPagination(page, propertiesCount)

        const properties = await Property.find()
            .sort({ createdAt: 'desc' })
            .skip((perPage * page) - perPage)
            .limit(perPage)

        res.render('properties/properties', { admin, propertiesList, propertyFormValues, properties, pagination })
    } catch (error) {
        console.log('Error al mostrar propiedades: ' + error)
    }

}

propertyCtrl.searchProperties = async (req, res) => {
    try {
        if (req.query.searchOperation || req.query.searchOperation === '') {
            formFields = {
                searchOperation: req.query.searchOperation || '',
                searchType: req.query.searchType || '',
                searchCity: req.query.searchCity || ''
            }
        } else {

            formFields = req.body
        }

        let operation, type
        if (formFields.searchOperation === '') {

            operation = propertyFormValues.enumOperation

        } else {

            operation = [formFields.searchOperation]

        }
        if (formFields.searchType === '') {

            type = propertyFormValues.enumType

        } else {

            if (formFields.searchType === 'Casa') {

                type = ['Casa', 'Dúplex - PH', 'Cabaña']

            } else if (formFields.searchType === 'Hotel - Complejo turístico') {

                type = ['Hotel - Complejo turístico', 'Cabaña']

            } else if (formFields.searchType === 'Departamento') {

                type = ['Departamento', 'Monoambiente']

            } else {

                type = [formFields.searchType]

            }
        }

        const page = parseInt(req.params.page) || 1
        const propertiesCount = await Property.countDocuments({
            $and: [
                {
                    operation: { $in: operation },
                },
                {
                    type: { $in: type },
                },
                {
                    $or: [
                        {
                            city: { $regex: '.*' + diacriticSensitiveRegex(formFields.searchCity) + '.*', $options: 'i' }
                        },
                        {
                            province: { $regex: '.*' + diacriticSensitiveRegex(formFields.searchCity) + '.*', $options: 'i' }
                        }
                    ]
                },
            ]
        })
        setPagination(page, propertiesCount)

        const properties = await Property.find({
            $and: [
                {
                    operation: { $in: operation },
                },
                {
                    type: { $in: type },
                },
                {
                    $or: [
                        {
                            city: { $regex: '.*' + diacriticSensitiveRegex(formFields.searchCity) + '.*', $options: 'i' }
                        },
                        {
                            province: { $regex: '.*' + diacriticSensitiveRegex(formFields.searchCity) + '.*', $options: 'i' }
                        }
                    ]
                },
            ]
        })
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({ createdAt: 'desc' })


        res.render('properties/properties', {
            admin,
            search,
            propertiesList,
            propertyFormValues,
            formFields,
            properties,
            pagination
        })
    } catch (error) {
        console.log('Error al buscar propiedades: ' + error)
    }
}

propertyCtrl.renderAddPropertyForm = (req, res) => {
    const type = req.params.type
    setPropertyForm(type)
    res.render('properties/form', { admin, propertyForm, propertyFormValues, type, map })
}

propertyCtrl.addProperty = async (req, res) => {
    try {
        const errors = validatePropertyForm(req.body, req.files, false)
        //console.log(req.body)
        // console.log(req.files)
        formFields = req.body

        if (errors.length > 0) {
            setPropertyForm(formFields.type)
            res.render('properties/form', { admin, propertyForm, propertyFormValues, formFields, errors })
        } else {

            let newProperty = setProperty()
            //console.log(newProperty)

            newProperty = await uploadPhotosToServer(req.files, newProperty)
            //console.log(newProperty)

            /*// Upload files to AWS-S3
            const date = new Date()
            newProperty.photosFolder = newProperty.type + '/' + date.toDateString() + ' - ' + formFields.address + '/'
            let photoPath

            if (req.files.propertyPhoto[0]) {
                const primaryPhoto = req.files.propertyPhoto[0]
                //// Preview photo
                const splitOriginalName = primaryPhoto.originalname.split('.', 2)
                primaryPhoto.name = splitOriginalName[0]
                primaryPhoto.ext = splitOriginalName[1]
                photoPath = newProperty.photosFolder + primaryPhoto.name + '-preview.' + primaryPhoto.ext
                await sharp(primaryPhoto.buffer)
                    .resize({ height: 200 })
                    .withMetadata()
                    .toBuffer()
                    .then(data => {
                        uploadFileS3(bucket, photoPath, data)
                    })
                newProperty.primaryPhotoPreviewPath = s3BasePath + photoPath

                //// Primary photo
                photoPath = newProperty.photosFolder + primaryPhoto.originalname
                await sharp(primaryPhoto.buffer)
                    .resize({
                        height: 1080,
                        withoutEnlargement: true
                    })
                    .withMetadata()
                    .toBuffer()
                    .then(outputBuffer => {
                        uploadFileS3(bucket, photoPath, outputBuffer)
                    });
                newProperty.primaryPhotoPath = s3BasePath + photoPath
            }

            //// Secondary photos
            const secondaryPhotos = req.files.propertyPhotos
            let i = 0
            const uploadSecondaryPhotos = async () => {
                if (i < secondaryPhotos.length) {
                    photoPath = newProperty.photosFolder + secondaryPhotos[i].originalname
                    await sharp(secondaryPhotos[i].buffer)
                        .resize({
                            height: 1080,
                            withoutEnlargement: true
                        })
                        .withMetadata()
                        .toBuffer()
                        .then(outputBuffer => {
                            uploadFileS3(bucket, photoPath, outputBuffer)
                        });
                    newProperty.secondaryPhotosPaths.push(s3BasePath + photoPath)
                    i++
                    await uploadSecondaryPhotos()
                }
            }
            await uploadSecondaryPhotos() */

            await newProperty.save()
            req.flash('msg_success', 'Nueva propiedad agregada')
            res.redirect('/admin/properties/1')
        }
    } catch (error) {
        console.log('Error al agregar propiedad: ' + error)
    }
}

propertyCtrl.renderUpdatePropertyForm = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
        formFields = property
        formFields.lat = property.location[0]
        formFields.lng = property.location[1]
        const type = property.type
        setPropertyForm(type)
        res.render('properties/form', { admin, propertyForm, propertyFormValues, formFields, edit, type, map })
    } catch (error) {
        console.log('Error al mostrar formulario para editar: ' + error)
    }
}

propertyCtrl.updateProperty = async (req, res) => {
    try {
        const errors = validatePropertyForm(req.body, req.files, true)

        formFields = req.body

        if (errors.length > 0) {
            res.render('properties/form', { admin, propertyForm, propertyFormValues, formFields, edit, errors })
        } else {

            await Property.findByIdAndUpdate(req.body._id, {
                type: formFields.type,
                outstanding: (formFields.outstanding === '1') ? true : false,
                province: formFields.province || null,
                city: formFields.city || null,
                address: formFields.address || null,
                location: [formFields.lat, formFields.lng],
                description: formFields.description,
                operation: formFields.operation,
                price: formFields.price,
                dollar: (formFields.dollar) ? true : false,
                hidePrice: (formFields.hidePrice) ? true : false,
                isMinPrice: (formFields.isMinPrice) ? true : false,
                youtubePath: formFields.youtubePath || null,
                neighborhoodType: formFields.neighborhoodType || null,
                totalArea: formFields.totalArea || null,
                hectare: formFields.hectare || false,
                coveredArea: formFields.coveredArea || null,
                activity: formFields.activity || null,
                access: formFields.access || null,
                asphaltDistance: formFields.asphaltDistance || null,
                bedrooms: formFields.bedrooms || null,
                capacity: formFields.capacity || null,
                offices: formFields.offices || null,
                bathrooms: formFields.bathrooms || null,
                garages: formFields.garages || null,
                totalRooms: formFields.totalRooms || null,
                floors: formFields.floors || null,
                antiquity: formFields.antiquity || null,
                orientation: formFields.orientation || null,
                garageType: formFields.garageType || null,
                garageAccess: formFields.garageAccess || null,
                features: formFields.features || []
            })
            req.flash('msg_success', 'Propiedad actualizada con éxito')
            res.redirect('/admin/properties/1')
        }
    } catch (error) {
        console.log('Error al editar propiedad: ' + error)
    }
}

propertyCtrl.renderUpdatePropertyPhotosForm = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
        res.render('properties/photos-form', { admin, property })
    } catch (error) {
        console.log('Error al mostrar formulario de fotos de propiedad: ' + error)
    }
}

propertyCtrl.updatePropertyPhotos = async (req, res) => {
    try {
        let property = await Property.findById(req.body.id)
        errors = validateFiles(req.body, req.files, true)
        if (req.body.id !== req.params.id) {
            errors.push({ text: 'Problema con IDs' })
        }
        if (errors.length > 0) {
            res.render('properties/photos-form', { admin, property, errors })
        } else {

            const newProperty = await updatePhotosToServer(req.files, property)

            // // Upload files to AWS-S3
            // let photoKey

            // if (req.files.propertyPhoto) {
            //     console.log('entre')
            //     const primaryPhoto = req.files.propertyPhoto[0]

            //     // Delete previous photos
            //     const primaryFilename = property.primaryPhotoPath.split('/')[5]
            //     const previewFilename = property.primaryPhotoPreviewPath.split('/')[5]
            //     const primaryPhotoKey = property.photosFolder + primaryFilename
            //     const previewPhotoKey = property.photosFolder + previewFilename
            //     await deleteFileS3(bucket, primaryPhotoKey)
            //     await deleteFileS3(bucket, previewPhotoKey)

            //     // Upload Preview photo
            //     const splitOriginalName = primaryPhoto.originalname.split('.', 2)
            //     primaryPhoto.name = splitOriginalName[0]
            //     primaryPhoto.ext = splitOriginalName[1]
            //     photoKey = property.photosFolder + primaryPhoto.name + '-preview.' + primaryPhoto.ext
            //     await sharp(primaryPhoto.buffer)
            //         .resize({ height: 200 })
            //         .withMetadata()
            //         .toBuffer()
            //         .then(data => {
            //             uploadFileS3(bucket, photoKey, data)
            //         })
            //     property.primaryPhotoPreviewPath = s3BasePath + photoKey

            //     // Upload primary photo
            //     photoKey = property.photosFolder + primaryPhoto.originalname
            //     await sharp(primaryPhoto.buffer)
            //         .resize({
            //             height: 1080,
            //             withoutEnlargement: true
            //         })
            //         .withMetadata()
            //         .toBuffer()
            //         .then(outputBuffer => {
            //             uploadFileS3(bucket, photoKey, outputBuffer)
            //         });
            //     property.primaryPhotoPath = s3BasePath + photoKey
            // }

            // if (req.files.propertyPhotos) {
            //     const secondaryPhotos = req.files.propertyPhotos

            //     // Delete previous secondary photos
            //     let i = 0
            //     let secondaryFilename
            //     let secondaryPhotoKey

            //     const clearSecondaryPhotos = async () => {
            //         if (i < property.secondaryPhotosPaths.length) {
            //             secondaryFilename = property.secondaryPhotosPaths[i].split('/')[5]
            //             secondaryPhotoKey = property.photosFolder + secondaryFilename
            //             await deleteFileS3(bucket, secondaryPhotoKey)
            //             i++
            //             await clearSecondaryPhotos()
            //         }
            //         property.secondaryPhotosPaths = []
            //     }
            //     await clearSecondaryPhotos()

            //     // Update Secondary photos
            //     i = 0
            //     const uploadSecondaryPhotos = async () => {
            //         if (i < secondaryPhotos.length) {
            //             photoKey = property.photosFolder + secondaryPhotos[i].originalname
            //             await sharp(secondaryPhotos[i].buffer)
            //                 .resize({
            //                     height: 1080,
            //                     withoutEnlargement: true
            //                 })
            //                 .withMetadata()
            //                 .toBuffer()
            //                 .then(outputBuffer => {
            //                     uploadFileS3(bucket, photoKey, outputBuffer)
            //                 });
            //             property.secondaryPhotosPaths.push(s3BasePath + photoKey)
            //             i++
            //             await uploadSecondaryPhotos()
            //         }
            //     }
            //     await uploadSecondaryPhotos()
            // }

            await Property.findByIdAndUpdate(req.body.id, {
                primaryPhotoPreviewPath: newProperty.primaryPhotoPreviewPath,
                primaryPhotoPath: newProperty.primaryPhotoPath,
                secondaryPhotosPaths: newProperty.secondaryPhotosPaths,
            })

            req.flash('msg_success', 'Propiedad actualizada con éxito')
            res.render('properties/photos-form', { admin, property })
        }
    } catch (error) {
        console.log('Error al editar fotos de propiedad: ' + error)
    }

}

propertyCtrl.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
        fs.remove(path.resolve(property.photosFolder), err => { if (err) { console.log(err) }})
        await Property.findByIdAndDelete(req.params.id)
        req.flash('msg_success', 'Propiedad eliminada con éxito')
        res.redirect('/admin/properties/1')
    } catch (error) {
        console.log('Delete property error: ' + error)
    }
}

// Methods
const setPropertyForm = type => {
    if (type === 'Casa'
        || type === 'Dúplex - PH'
        || type === 'Cabaña'
        || type === 'Departamento'
        || type === 'Monoambiente'
        || type === 'Local'
        || type === 'Oficina'
        || type === 'Galpón - Depósito'
        || type === 'Hotel - Complejo turístico'
    ) {
        propertyForm = { casa: true }
        propertyFormValues.enumFeatures = enumFeaturesCasa

        if (type === 'Local'
            || type === 'Oficina'
            || type === 'Galpón - Depósito'
        ) {
            propertyForm = { casa: true, local: true }
        }

        if (type === 'Hotel - Complejo turístico') {
            propertyForm = { casa: true, hotel: true }
        }
    } else if (type === 'Terreno - Lote'
        || type === 'Campo'
    ) {
        propertyForm = { campo: true }
        propertyFormValues.enumFeatures = enumFeaturesCampo
    } else if (type === 'Cocheras') {
        propertyForm = { cochera: true }
        propertyFormValues.enumFeatures = enumFeaturesCochera
    } else if (type === 'Negocio - Fondo de comercio') {
        propertyForm = { negocio: true }
        propertyFormValues.enumFeatures = enumFeaturesNegocio
    } else {
        propertyForm = { otros: true }
        propertyFormValues.enumFeatures = enumFeaturesOtros
    }
}

const validatePropertyForm = (body, files, edit) => {
    errors = validateFiles(body, files, edit)


    // Select validation 
    if (propertyFormValues.enumOperation.indexOf(body.operation) < 0
        || propertyFormValues.enumType.indexOf(body.type) < 0
    ) {
        errors.push({ text: 'Operación y/o tipo fuera de rango' })
    }

    // Empty fields validation
    if (body.operation === ''
        || body.type === ''
        || body.description === ''
        || body.price === ''
        || body.lat === ''
        || body.lng === ''
    ) {
        errors.push({ text: 'Debe completar todos los campos' })
    }

    // Max length of fields validation
    if (body.address.length > 50
        || body.city.length > 50
        || body.youtubePath.length > 100
        || body.description.length > 9999
    ) {
        errors.push({
            text: 'Ha superado el máximo de caracteres para los campos dirección (50),'
                + ' ciudad (50) y/o descripción (9999)'
        })
    }

    // Out of range number fields validation
    const lat = parseFloat(body.lat)
    const lng = parseFloat(body.lng)
    if ((1 > body.price || body.price > 999999999)
        || (-90 > lat || lat > 90)
        || (-180 > lng || lng > 180)
    ) {
        errors.push({ text: 'Precio o localización fuera del rango admitido' })
    }

    if (body.type === 'Casa'
        || body.type === 'Dúplex - PH'
        || body.type === 'Cabaña'
        || body.type === 'Departamento'
        || body.type === 'Monoambiente'
        || body.type === 'Local'
        || body.type === 'Oficina'
        || body.type === 'Galpón - Depósito'
        || body.type === 'Hotel - Complejo turístico'
    ) {
        propertyFormValues.enumFeatures = enumFeaturesCasa

        // Select validation 
        if (propertyFormValues.enumProvince.indexOf(body.province) < 0
            || propertyFormValues.enumNeighborhoodType.indexOf(body.neighborhoodType) < 0
            || propertyFormValues.enumOrientation.indexOf(body.orientation) < 0
        ) {
            errors.push({ text: 'Provincia, orientación y/o tipo de barrio fuera de rango' })
        }

        // Empty fields validation
        if (body.province === ''
            || body.city === ''
            || body.address === ''
            || body.antiquity === ''
            || body.totalArea === ''
            || body.coveredArea === ''
            || body.bedrooms === ''
            || body.bathrooms === ''
            || body.garages === ''
            || body.totalRooms === ''
            || body.floors === ''
            || body.neighborhoodType === ''
            || body.orientation === ''
        ) {
            errors.push({ text: 'Debe completar todos los campos' })
        }

        // Out of range number fields validation
        if ((0 > body.antiquity || body.antiquity > 999)
            || (1 > body.totalArea || body.totalArea > 99999999)
            || (1 > body.coveredArea || body.coveredArea > 99999999)
            || (0 > body.bathrooms || body.bathrooms > 99)
            || (0 > body.garages || body.garages > 99)
            || (1 > body.totalRooms || body.totalRooms > 99)
            || (1 > body.floors || body.floors > 99)
        ) {
            errors.push({ text: 'Alguno de los campos numéricos se encuentra fuera del rango admitido' })
        }

        if (body.type === 'Local'
            || body.type === 'Oficina'
            || body.type === 'Galpón - Depósito'
        ) {
            if (body.offices === '') {
                errors.push({ text: 'Debe completar todos los campos' })
            }
            if (0 > body.offices || body.offices > 99) {
                errors.push({ text: 'Oficinas fuera del rango admitido' })
            }
        } else if (body.type === 'Hotel - Complejo turístico') {
            if (body.capacity === '') {
                errors.push({ text: 'Debe completar todos los campos' })
            }
            if (0 > body.capacity || body.capacity > 999) {
                errors.push({ text: 'Capacidad fuera del rango admitido' })
            }
        } else {
            if (body.bedrooms === '') {
                errors.push({ text: 'Debe completar todos los campos' })
            }
            if (0 > body.bedrooms || body.bedrooms > 99) {
                errors.push({ text: 'Habitaciones fuera del rango admitido' })
            }
        }

    } else if (body.type === 'Terreno - Lote'
        || body.type === 'Campo'
    ) {
        propertyFormValues.enumFeatures = enumFeaturesCampo

        // Select validation 
        if (propertyFormValues.enumProvince.indexOf(body.province) < 0
            || propertyFormValues.enumNeighborhoodType.indexOf(body.neighborhoodType) < 0
            || propertyFormValues.enumOrientation.indexOf(body.orientation) < 0
            || propertyFormValues.enumAccess.indexOf(body.access) < 0
        ) {
            errors.push({ text: 'Provincia, orientación, acceso y/o tipo de barrio fuera de rango' })
        }

        // Empty fields validation
        if (body.province === ''
            || body.city === ''
            || body.address === ''
            || body.totalArea === ''
            || body.neighborhoodType === ''
            || body.orientation === ''
            || body.access === ''
            || body.asphaltDistance === ''
        ) {
            errors.push({ text: 'Debe completar todos los campos' })
        }

        // Out of range number fields validation
        if ((1 > body.totalArea || body.totalArea > 99999999)
            || (0 > body.asphaltDistance || body.asphaltDistance > 999)
        ) {
            errors.push({ text: 'Alguno de los campos numéricos se encuentra fuera del rango admitido' })
        }

    } else if (body.type === 'Cocheras') {
        propertyFormValues.enumFeatures = enumFeaturesCochera

        // Select validation 
        if (propertyFormValues.enumProvince.indexOf(body.province) < 0
            || propertyFormValues.enumOrientation.indexOf(body.orientation) < 0
            || propertyFormValues.enumGarageType.indexOf(body.garageType) < 0
            || propertyFormValues.enumGarageAccess.indexOf(body.garageAccess) < 0
        ) {
            errors.push({ text: 'Provincia, orientación, acceso de cochera y/o tipo de cochera fuera de rango' })
        }

        // Empty fields validation
        if (body.province === ''
            || body.city === ''
            || body.address === ''
            || body.totalArea === ''
            || body.coveredArea === ''
            || body.antiquity === ''
            || body.orientation === ''
            || body.garageType === ''
            || body.garageAccess === ''
        ) {
            errors.push({ text: 'Debe completar todos los campos' })
        }

        // Out of range number fields validation
        if ((1 > body.totalArea || body.totalArea > 99999999)
            || (1 > body.coveredArea || body.coveredArea > 99999999)
            || (0 > body.antiquity || body.antiquity > 999)
        ) {
            errors.push({ text: 'Alguno de los campos numéricos se encuentra fuera del rango admitido' })
        }

    } else if (body.type === 'Negocio - Fondo de comercio') {
        propertyFormValues.enumFeatures = enumFeaturesNegocio

        // Select validation 
        if (propertyFormValues.enumProvince.indexOf(body.province) < 0
        ) {
            errors.push({ text: 'Provincia fuera de rango' })
        }

        // Empty fields validation
        if (body.province === ''
            || body.city === ''
            || body.address === ''
            || body.activity === ''
            || body.antiquity === ''
        ) {
            errors.push({ text: 'Debe completar todos los campos' })
        }

        // Out of range number fields validation
        if (0 > body.antiquity || body.antiquity > 999) {
            errors.push({ text: 'Antigüedad fuera del rango admitido' })
        }

    } else {
        propertyFormValues.enumFeatures = enumFeaturesOtros
    }

    return errors
}

const validateFiles = (body, files, editPhoto) => {
    errors = []
    var fileEmptyError,
        fileTypeError,
        fileCountError = false

    // Input file single
    if (files.propertyPhoto) {
        // Validation file type (image/gif, image/png, image/jpeg, image/bmp, image/webp)
        if (files.propertyPhoto[0]) {
            const propertyPhotoMimeType = files.propertyPhoto[0].mimetype
            if (propertyPhotoMimeType !== 'image/png'
                && propertyPhotoMimeType !== 'image/gif'
                && propertyPhotoMimeType !== 'image/jpeg'
                && propertyPhotoMimeType !== 'image/bmp'
                && propertyPhotoMimeType !== 'image/webp'
            ) fileTypeError = true
            if (files.propertyPhoto.length > 1) fileCountError = true
        } else {
            if (body.type !== 'Otros' && !editPhoto) {
                fileEmptyError = true
            }
        }
    }

    // Input file multiple
    if (files.propertyPhotos) {
        propertyPhotos = files.propertyPhotos
        const validateType = (file) => {
            if (file.mimetype !== 'image/png'
                && file.mimetype !== 'image/gif'
                && file.mimetype !== 'image/jpeg'
                && file.mimetype !== 'image/bmp'
                && file.mimetype !== 'image/webp'
            ) { return true } else { return false }
        }
        if (propertyPhotos.some(validateType)) fileTypeError = true
        if (files.propertyPhotos.length > 13) fileCountError = true
    } else {
        if (!editPhoto) {
            fileEmptyError = true
        }
    }

    if (fileTypeError) errors.push({ text: 'Error en los tipos de archivo' })
    if (fileCountError) errors.push({
        text: 'Has superado la cantidad máxima de fotos por propiedad.'
            + ' Ingresa una foto principal y un máximo de 10 fotos secundarias'
    })
    if (fileEmptyError) errors.push({ text: 'Debe seleccionar foto primaria y/o fotos secundarias' })

    return errors
}

const setProperty = () => {
    return new Property({
        type: formFields.type,
        outstanding: (formFields.outstanding) ? true : false,
        province: formFields.province || null,
        city: formFields.city || null,
        address: formFields.address || null,
        location: [formFields.lat, formFields.lng],
        description: formFields.description,
        operation: formFields.operation,
        price: formFields.price,
        dollar: (formFields.dollar) ? true : false,
        hidePrice: (formFields.hidePrice) ? true : false,
        isMinPrice: (formFields.isMinPrice) ? true : false,
        secondaryPhotosPaths: [],
        youtubePath: formFields.youtubePath || null,
        neighborhoodType: formFields.neighborhoodType || null,
        totalArea: formFields.totalArea || null,
        hectare: formFields.hectare || false,
        coveredArea: formFields.coveredArea || null,
        activity: formFields.activity || null,
        access: formFields.access || null,
        asphaltDistance: formFields.asphaltDistance || null,
        bedrooms: formFields.bedrooms || null,
        capacity: formFields.capacity || null,
        offices: formFields.offices || null,
        bathrooms: formFields.bathrooms || null,
        garages: formFields.garages || null,
        totalRooms: formFields.totalRooms || null,
        floors: formFields.floors || null,
        antiquity: formFields.antiquity || null,
        orientation: formFields.orientation || null,
        garageType: formFields.garageType || null,
        garageAccess: formFields.garageAccess || null,
        features: formFields.features || [],
    })
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

const uploadPhotosToServer = async (files, property) => {
    try {
        const primaryPhoto = files.propertyPhoto[0]
        const splitOriginalName = primaryPhoto.originalname.split('.', 2)
        primaryPhoto.ext = splitOriginalName[1]
        const secondaryPhotos = files.propertyPhotos
    
        const urlBase = 'src/public/upload/' + property.type + '/' + property._id
        const basePath = '/upload/' + property.type + '/' + property._id
        property.photosFolder = './' + urlBase
        fs.mkdir(path.resolve(urlBase), { recursive: true }, err => { })
    
        const urlPrimary = urlBase + '/1.' + primaryPhoto.ext
        property.primaryPhotoPath = basePath + '/1.' + primaryPhoto.ext
        await sharp(primaryPhoto.buffer)
            .resize({
                height: 400,
                withoutEnlargement: true
            })
            .withMetadata()
            .toBuffer()
            .then(data => {
                fs.writeFileSync(urlPrimary, data)
            })
    
        const urlPreview = urlBase + '/preview.' + primaryPhoto.ext
        property.primaryPhotoPreviewPath = basePath + '/preview.' + primaryPhoto.ext
        await sharp(primaryPhoto.buffer)
            .resize({
                height: 200,
                withoutEnlargement: true
            })
            .withMetadata()
            .toBuffer()
            .then(data => {
                fs.writeFileSync(urlPreview, data)
            })
    
        let secondaryPhoto
        let urlSecondary
        let i = 0
        const uploadSecondaryPhotos = async () => {
            if (i < secondaryPhotos.length) {
                secondaryPhoto = secondaryPhotos[i]
                const splitOriginalNameSecondary = secondaryPhoto.originalname.split('.', 2)
                const ext = splitOriginalNameSecondary[1]
                indice = i + 2
                urlSecondary = urlBase + '/' + indice + '.' + ext
                property.secondaryPhotosPaths.push(basePath + '/' + indice + '.' + ext)
                await sharp(secondaryPhoto.buffer)
                    .resize({
                        height: 400,
                        withoutEnlargement: true
                    })
                    .withMetadata()
                    .toBuffer()
                    .then(data => {
                        fs.writeFileSync(urlSecondary, data)
                    })
                i++
                await uploadSecondaryPhotos()
            }
        }
        await uploadSecondaryPhotos()
    
        return property 
    } catch (error) {
        console.log('Error al subir fotos al servidor: ' + error)
    }
}

const updatePhotosToServer = async (files, property) => {
    try {
        if (files.propertyPhoto) {
            const primaryPhoto = files.propertyPhoto[0]
    
            // Delete previous photos
            const primaryFilename = property.primaryPhotoPath.split('/')[4]
            const previewFilename = property.primaryPhotoPreviewPath.split('/')[4]
            const primaryPhotoPath = property.photosFolder + '/' + primaryFilename
            console.log(primaryPhotoPath)
            const previewPhotoPath = property.photosFolder + '/' + previewFilename
            console.log(previewPhotoPath)
            fs.unlinkSync(primaryPhotoPath)
            fs.unlinkSync(previewPhotoPath)
    
            // Update Preview photo
            const splitOriginalName = primaryPhoto.originalname.split('.', 2)
            primaryPhoto.ext = splitOriginalName[1]
            let urlPhoto = property.photosFolder.replace('./', '') + '/preview.' + primaryPhoto.ext
            property.primaryPhotoPreviewPath = urlPhoto.replace('src/public', '')
            await sharp(primaryPhoto.buffer)
                .resize({
                    height: 200,
                    withoutEnlargement: true
                })
                .withMetadata()
                .toBuffer()
                .then(data => {
                    fs.writeFile(urlPhoto, data, err => {})
                })
    
            // Update primary photo
            urlPhoto = property.photosFolder.replace('./', '') + '/1.' + primaryPhoto.ext
            property.primaryPhotoPath = urlPhoto.replace('src/public', '')
            await sharp(primaryPhoto.buffer)
                .resize({
                    height: 1080,
                    withoutEnlargement: true
                })
                .withMetadata()
                .toBuffer()
                .then(data => {
                    fs.writeFile(urlPhoto, data, err => {})
                })
        }
    
        if (files.propertyPhotos) {
            const secondaryPhotos = files.propertyPhotos
    
            // Delete previous secondary photos
            let i = 0
            let secondaryFilename
            let secondaryPhotoPath
    
            const clearSecondaryPhotos = () => {
                if (i < property.secondaryPhotosPaths.length) {
                    secondaryFilename = property.secondaryPhotosPaths[i].split('/')[4]
                    secondaryPhotoPath = property.photosFolder + '/' + secondaryFilename
                    fs.unlinkSync(secondaryPhotoPath)
                    i++
                    clearSecondaryPhotos()
                }
            }
            clearSecondaryPhotos()
            property.secondaryPhotosPaths = []
    
            // Update Secondary photos
            i = 0
            let urlPhoto
            let secondaryPhoto
            const updateSecondaryPhotos = async () => {
                if (i < secondaryPhotos.length) {
                    secondaryPhoto = secondaryPhotos[i]
                    const splitOriginalNameSecondary = secondaryPhoto.originalname.split('.', 2)
                    const ext = splitOriginalNameSecondary[1]
                    indice = i + 2
                    urlPhoto = property.photosFolder.replace('./', '') + '/' + indice + '.' + ext
                    await sharp(secondaryPhoto.buffer)
                        .resize({
                            height: 1080,
                            withoutEnlargement: true
                        })
                        .withMetadata()
                        .toBuffer()
                        .then(data => {
                            fs.writeFile(urlPhoto, data, err => {})
                        });
                    property.secondaryPhotosPaths.push(urlPhoto.replace('src/public', ''))
                    i++
                    await updateSecondaryPhotos()
                }
            }
            await updateSecondaryPhotos()
        }
    
        return property

    } catch (error) {
        console.log('Error al subir fotos actualizadas al servidor: ' + error)
    }
}

// S3 methods
const uploadFileS3 = async (bucket, key, buffer) => {
    try {
        const putObjectParams = {
            Bucket: bucket,
            Key: key,
            Body: buffer
        }
        await s3.putObject(putObjectParams, (err, data) => {
            if (err) throw err
        })
    } catch (error) {
        console.log('Error al subir fotos a AWS S3: ' + error)
    }
}

const deleteFileS3 = async (bucket, key) => {
    try {
        const deleteObjectParams = {
            Bucket: bucket,
            Key: key
        }
        await s3.deleteObject(deleteObjectParams, (err, data) => {
            if (err) throw err
        })
    } catch (error) {
        console.log('Error al borrar fotos de AWS S3: ' + error)
    }
}

const emptyS3Directory = async (bucket, dir) => {
    try {
        const listParams = {
            Bucket: bucket,
            Prefix: dir
        };

        const listedObjects = await s3.listObjectsV2(listParams).promise();

        if (listedObjects.Contents.length === 0) return;

        const deleteParams = {
            Bucket: bucket,
            Delete: { Objects: [] }
        };

        listedObjects.Contents.forEach(({ Key }) => {
            deleteParams.Delete.Objects.push({ Key });
        });

        await s3.deleteObjects(deleteParams).promise();

        if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);

    } catch (error) {
        console.log('Error al vaciar carpeta de AWS S3: ' + error)
    }
}

module.exports = propertyCtrl