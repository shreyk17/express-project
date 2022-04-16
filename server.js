const express = require('express')
const dotenv = require('dotenv');
const cors = require('cors');
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const user = require('./routes/users')
const reviews = require('./routes/reviews')
const logger = require('./middlewares/Logger')
const morgan = require('morgan')
const connectDb = require('./config/db')
const colors = require('colors')
const errorHandler = require('./middlewares/error')
const fileupload = require('express-fileupload')
const path = require('path')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')

//load env files
dotenv.config({
    path: './config/config.env'
});

//connect to db
connectDb()

const app = express();

//body parser
app.use(express.json())


//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
} else {
    app.use(logger)
}

//file upload
app.use(fileupload())

//mongo sanitize 
app.use(mongoSanitize())

//helmet
app.use(helmet())

//xss clean
app.use(xss())

//enable cors
app.use(cors())

//rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
})

app.use(limiter)

//hpp
app.use(hpp())

//cookie parser
app.use(cookieParser())

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

//mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', user)
app.use('/api/v1/reviews', reviews)


const port = process.env.PORT || 5000;

const server = app.listen(port, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.inverse.italic.bold));

//handle rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`.white.bgRed)
    //close server
    server.close(() => process.exit(1));
})

//error handler
app.use(errorHandler)