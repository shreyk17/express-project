const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const User = require('../models/User')

// @desc  GET ALL USERS
// @route GET /api/v1/auth/users
// @access private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults)

})

// @desc  GET SINGLE USER
// @route GET /api/v1/auth/usesr/:id
// @access private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    res.status(200).json({
        success: true,
        data: user
    })

})

// @desc  CREATE USER
// @route POST /api/v1/auth/users
// @access private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {

    const user = await User.create(req.body)

    res.status(201).json({
        success: true,
        data: user
    })

})

// @desc  UPDATE USER
// @route PUT /api/v1/auth/users/:id
// @access private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user
    })

})

// @desc  DELETE USER
// @route DELETE /api/v1/auth/users/:id
// @access private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {

    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        data: {}
    })

})