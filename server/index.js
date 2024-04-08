const express = require ('express');
const dotenv = require ('dotenv').config()
const cors = require('cors')
const {mongoose} = require ('mongoose')
const cookieParser = require('cookie-parser')
const microsoftAuthRoutes = require('./routes/microsoftAuthRoutes');
const calendarRoutes = require('./routes/calendarRoutes');

const app = express();

// Place this near the top of your app.js or server.js, right after initializing your Express app
const corsOptions = {
    origin: 'http://localhost:5173', // Allow only your React app to communicate with this backend
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'OPTIONS'], // Adjust according to your needs
  };
  
app.use(cors(corsOptions));
  

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
app.use(calendarRoutes);

app.use('/', require('./routes/authRoutes'))

const port = process.env.PORT || 8000;
app.listen (port, () => console.log(`Server is running on port ${port}`))