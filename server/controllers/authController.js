const User = require ('../models/user')
const {hashPassword, comparePassword} = require('../helpers/auth')

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
            name, email, password : hashedPassword
        })

        return res.json(user)

    }   catch (error){
        console.log(error)
    }
}

module.exports = {
    test,
    registerUser
}