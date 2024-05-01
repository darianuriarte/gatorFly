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

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: 'User not found'
            });
        }

        // Check if passwords match
        const match = await comparePassword(password, user.password);
        if (match) {
            const token = jwt.sign(
                { email: user.email, id: user._id, name: user.name },
                process.env.JWT_SECRET
            );
            // Return the token directly in response instead of setting a cookie
            return res.json({ token, user });
        } else {
            return res.json({
                error: 'Passwords do not match'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred during the login process.' });
    }
};


const getProfile = (req, res) => {
    // Assuming the token is sent in the Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // Bearer Token
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Failed to authenticate token." });
            }
            res.json(decoded);
        });
    } else {
        res.status(401).json({ error: "No token provided." });
    }
};


const logoutUser = (req, res) => {
    res.clearCookie('token'); // Clear the JWT token stored in the cookie
    res.json({ message: "Logged out successfully" }); // Send a success message
}


module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    logoutUser
}
