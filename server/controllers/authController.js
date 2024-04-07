const User = require ('../models/user')
const {hashPassword, comparePassword} = require('../helpers/auth')
const jwt = require('jsonwebtoken')

const test = (req, res) => {
    res.json('test is working')
}

const registerUser = async (req, res) => {
    try {
        const {name, email, password} =  req.body;
        // Check if name was entered
        if(!name){
            return res.json({
                error: 'name is required'
            })
        }

        //Check password
        if(!password || password.length < 6){

            return res.json({
                error: 'Password required. Must be at least 6 characters long'
            })
        }

        //Check email
        const exist = await User.findOne({email});
        if (exist){
            return res.json({
                error: 'There is already an user registered with this email'
            })
        }

        const hashedPassword = await hashPassword(password)

        // Send user to dataBase
        const user = await User.create({
            name, email, password : hashedPassword,
        })

        return res.json(user)

    }   catch (error){
        console.log(error)
    }
}

//Login Endpoint
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        //Check if user exists
        const user = await User.findOne({email});
        if (!user){
            return res.json({
                error: 'User not found'
            })
        }

        //Check if passwords match
        const match = await comparePassword(password, user.password)
        if (match){
            jwt.sign({email: user.email, id: user._id, name: user.name}, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "An error occurred during the login process." });
                }
                res.cookie('token', token).json(user)
            })

        }
        if(!match){
            res.json({
                error: 'Passwords do not match'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

const getProfile =(req, res) =>{
    const {token} = req.cookies
    if (token){
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) =>{
            if (err) throw err;
            res.json(user)
        } )
    } else {
        res.json(null)
    }

   
}


module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
}