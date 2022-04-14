const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')

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


// @desc  Forget Password
// @route POST /api/v1/auth/forgotpassword
// @access public
exports.forgotPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({
        email: req.body.email
    })

    if (!user) {
        return next(new ErrorResponse(`There is no user with ${req.body.email}`, 404))
    }

    //reset token
    const resetToken = user.getResetPasswordToken()

    console.log("---Reset Token---" + resetToken)

    await user.save({
        validateBeforSave: false
    })

    // create reset url 
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`

    const message = `Reset link is ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        })

        res.status(200).json({
            success: true,
            data: "Email sent successfully."
        })
    } catch (error) {
        console.log(error)
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({
            validateBeforSave: false
        })

        return next(new ErrorResponse(`Email could not be sent.`, 500))
    }

    res.status(200).json({
        success: true,
        data: user
    })
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