const { Schema, model } = require('mongoose')
const path = require('path')

const imageSchema = new Schema({
    filename: { type: String, required: true },
    pathname: { type: String, required: true },
    property_id: { type: ObjectId, required: true }
}, {
    timestamps: true
})

imageSchema.virtual('uniqueId')
    .get(function () {
        return this.filename.replace(path.extname(this.filename), '')
    })

module.exports = model('Image', imageSchema)