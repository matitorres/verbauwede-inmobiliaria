const { Schema, model } = require('mongoose')
const { 
    enumOperations, 
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
    enumGarageAccess 
} = require('../public/values')

const arr = [enumFeaturesCasa, enumFeaturesCampo, enumFeaturesCochera, enumFeaturesNegocio, enumFeaturesOtros]
const enumFeatures = [...new Set([].concat(...arr))]

const propertySchema = new Schema({
    operation: {
        type: String,
        enum: enumOperations,
        required: true
    },
    type: {
        type: String,
        enum: enumType,
        required: true
    },
    province: {
        type: String,
        enum: enumProvince,
        maxlength: 50
    },
    city: {
        type: String,
        trim: true,
        maxlength: 50
    },
    address: {
        type: String,
        trim: true,
        maxlength: 50
    },
    neighborhoodType: {
        type: String,
        enum: enumNeighborhoodType
    },
    totalArea: {
        type: Number,
        min: 1,
        max: 99999999
    },
    hectare:{
        type: Boolean,
        required: true
    },
    coveredArea: {
        type: Number,
        min: 1,
        max: 99999999
    },
    activity: {
        type: String,
        trim: true,
        maxlength: 50
    },
    access: {
        type: String,
        enum: enumAccess
    },
    asphaltDistance: {
        type: Number,
        min: 0,
        max: 999
    },
    bedrooms: {
        type: Number,
        min: 0,
        max: 99
    },
    capacity: {
        type: Number,
        min: 0,
        max: 999
    },
    offices: {
        type: Number,
        min: 0,
        max: 99
    },
    bathrooms: {
        type: Number,
        min: 0,
        max: 99
    },
    garages: {
        type: Number,
        min: 0,
        max: 99
    },
    totalRooms: {
        type: Number,
        min: 0,
        max: 99
    },
    floors: {
        type: Number,
        min: 0,
        max: 99
    },
    antiquity: {
        type: Number,
        min: 0,
        max: 999
    },
    orientation: {
        type: String,
        enum: enumOrientation
    },
    garageType: {
        type: String,
        enum: enumGarageType
    },
    garageAccess: {
        type: String,
        enum: enumGarageAccess
    },
    features: {
        type: [{ 
            type: String,
            enum: enumFeatures,
        }],
        required: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 9999,
        required: true
    },
    primaryPhotoPath: {
        type: String,
        required: true
    },
    primaryPhotoPreviewPath: {
        type: String,
        required: true
    },
    secondaryPhotosPaths: {
        type: [String],
        required: true
    },
    youtubePath: {
        type: String,
        maxlength: 100
    },
    price: {
        type: Number,
        min: 1,
        max: 999999999,
        required: true
    },
    dollar: {
        type: Boolean,
        required: true
    },
    hidePrice: {
        type: Boolean,
        required: true
    },
    isMinPrice: {
        type: Boolean,
        required: true
    },
    location: {
        type: [Number],
        required: true
    },
    outstanding: {
        type: Boolean,
        required: true
    },
    photosFolder: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = model('Property', propertySchema)