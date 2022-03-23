const express = require('express')
const dotenv = require('dotenv');
const req = require('express/lib/request');
const bootcamps = require('./routes/bootcamps')
const logger = require('./middlewares/Logger')
const morgan = require('morgan')

//load env files
dotenv.config({path : './config/config.env'});

const app = express();

//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}else {
    app.use(logger)
}

//moute routers
app.use('/api/v1/bootcamps' , bootcamps)

const port = process.env.PORT || 5000;

app.listen(port,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`));