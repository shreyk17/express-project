const NodeGeocoder = require('node-geocoder');
const dotenv = require('dotenv');

//load env files
dotenv.config({path : './config/config.env'});

const options = {
    provider : process.env.GEO_CODER_PROVIDER,
    httpAdapter: 'https',
    apiKey : process.env.GEO_CODER_API_KEY,
    formatter : null
}

const geocoder = NodeGeocoder(options);

module.exports = geocoder 