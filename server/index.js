const express = require ('express');
const dotenv = require ('dotenv').config()
const cors = require('cors')
const {mongoose} = require ('mongoose')
const cookieParser = require('cookie-parser')
const microsoftAuthRoutes = require('./routes/microsoftAuthRoutes');

const app = express();

//MongoDB data base connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Database connected'))
.catch((err) => console.log('Error connecting database', err))

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}))
// Use the Microsoft auth routes
app.use(microsoftAuthRoutes);

app.use('/', require('./routes/authRoutes'))

const port = process.env.PORT || 8000;
app.listen (port, () => console.log(`Server is running on port ${port}`))