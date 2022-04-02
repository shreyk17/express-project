const express = require('express')
const dotenv = require('dotenv');
const req = require('express/lib/request');
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const logger = require('./middlewares/Logger')
const morgan = require('morgan')
const connectDb = require('./config/db')
const colors = require('colors')
const errorHandler = require('./middlewares/error')

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

//mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)


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