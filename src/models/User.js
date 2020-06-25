const { Schema , model } = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
}, {
    timestamps: true
})

UserSchema.methods.hashPass = async pass => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(pass, salt)
}

UserSchema.methods.matchPass = async function(pass) {
    return await bcrypt.compare(pass, this.password)
}

module.exports = model('User', UserSchema)