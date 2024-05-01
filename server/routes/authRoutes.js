const express = require('express')
const router = express.Router()
const cors =  require('cors')
const {test, registerUser, loginUser, getProfile, logoutUser} = require('../controllers/authController')

//middleware
router.use(
    cors({
        credentials: true,
        origin: 'https://gatorfly-frontend.onrender.com'
    })
)

router.get('/', test)

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', getProfile)
router.get('/logout', logoutUser);

module.exports = router
