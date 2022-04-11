const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const User = require('../models/User')

// @desc  REGISTER USER
// @route GET /api/v1/auth/register
// @access public  

exports.register = asyncHandler(async (req, res, next) => {

    const {
        name,
        email,
        password,
        role
    } = req.body

    //create user
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    sendTokenResponse(user, 200, res)

})

// @desc  LOGIN USER
// @route POST /api/v1/auth/login
// @access public  

exports.login = asyncHandler(async (req, res, next) => {

    const {
        email,
        password,
    } = req.body

    //validating email or password
    if (!email || !password) {
        return next(new ErrorResponse('Email or password is mandatory', 400))
    }

    //check for user
    const user = await User.findOne({
        email: email
    }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    //check if password matche
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    sendTokenResponse(user, 200, res)

})


//get token from model , create cookie & send res
const sendTokenResponse = (user, statusCode, res) => {
    //create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    })
}

// @desc  Current logged in User
// @route POST /api/v1/auth/me
// @access private
exports.getLoggedInUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
})