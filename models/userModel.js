const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// Register User
userSchema.statics.register = async function (name, profile, email, password) {
    // validation
    if (!name || !profile || !email || !password) {
        throw Error("All fields must be filled!")
    }

    // cheack if the email is valid
    if (!validator.isEmail(email)) {
        throw Error("Invalid email")
    }

    const exist = await this.findOne({ email })

    if(exist){
        throw Error("This Email already used")
    }

    if(!validator.isStrongPassword(password)){
        throw Error('Password is not strong, try to combine uppercase, locawercase, number, symbol and minimum of 8 charectors!')
    }
    // encrypt password or hashing
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    // create a user
    const user = await this.create({name, profile, email, password: hash})
    return user;
}

// Login User
userSchema.statics.login = async function (email, password) {
    // validation
    if (!email || !password) {
        throw Error("All fields must be filled!")
    }
    const user = await this.findOne({ email })

    if(!user){
        throw Error("Incorrect email")
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw Error("Incorrect Password")
    }
    return user;
}

module.exports = mongoose.model('User', userSchema)