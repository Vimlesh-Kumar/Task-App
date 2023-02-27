const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true,
        trim: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error("Email is not valid")
            }
        }
    },
    password:
    {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password not contain password!!")
            }
            // if(!validator.isStrongPassword(value))
            // {
            //     throw new Error("Please enter min 8 char long.At least one uppercase.At least one lower case.At least one special character.")
            // }
        }
    },
    age:
    {
        type: Number,
        default: 0,
        validate(value) {

            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// public profile data
userSchema.methods.toJSON = function () {
    const user=this
    const userObject=user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

// token creation for user
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
    user.tokens = user.tokens.concat({ token })
    user.save()
    return token
}

// login to user
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("Unable to login...")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Unable to login.. \n Password not matched..")
    }
    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User