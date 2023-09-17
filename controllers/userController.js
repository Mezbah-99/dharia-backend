const jwt = require('jsonwebtoken')
const User = require("../models/userModel");


let profile = ""
const profileController = (req, res) => {
    //console.log(req.file)
    profile = `photos/${req.file.filename}`
}







const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET, {expiresIn: '7d'})
}


const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.login(email, password)
        
        // create token
        const token = createToken(user._id)

        res.status(200).json({name: user.name, profile: user.profile, email, token, id: user._id})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const registerUser = async (req, res) => {
    console.log(profile)
    const {name, email, password} = req.body;
    try {
        const user = await User.register(name, profile, email, password)
        
        // create token
        const token = createToken(user._id)

        res.status(200).json({name, profile, email, token, id: user._id})
        profile = ""
    } catch (error) {
        console.log(profile)
        res.status(400).json({error: error.message})
        profile = ""
    }
}

module.exports = {
    loginUser, registerUser, profileController
}