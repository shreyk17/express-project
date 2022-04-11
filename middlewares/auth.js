const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

//protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1]
        console.log(token)
    }
    // else if(req.cookies.token){
    //     token = req.cookies.token
    // }

    //token exists
    if (!token) {
        return next(new ErrorResponse('User not authorized', 401))
    }

    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('Decoded', decoded)

        req.user = await User.findById(decoded.id);

        next();

    } catch (error) {
        return next(new ErrorResponse('User not authorized', 401))
    }

})