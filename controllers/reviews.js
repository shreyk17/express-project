const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const Bootcamp = require('../models/Bootcamp')
const Review = require('../models/Review')

// @desc  Get Reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/bootcamps/:bootcampId/reviews
// @access PUBLIC
exports.getReviews = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const reviews = await Review.find({
            bootcamp: req.params.bootcampId
        })

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        res.status(200).json(res.advancedResults)
    }

})


// @desc  Get Single Review
// @route GET /api/v1/reviews/:id
// @access PUBLIC
exports.getReview = asyncHandler(async (req, res, next) => {

    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })

    if (!review) {
        return next(new ErrorResponse(`No review found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: review
    })

})


// @desc  Add Review
// @route POSt /api/v1/bootcamps/:bootcampId/reviews
// @access PRIVATE
exports.addReview = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp doesn't exixst with id ${req.params.bootcampId}`, 404))
    }

    const review = await Review.create(req.body)

    res.status(201).json({
        success: true,
        data: review
    })

})


// @desc  Update Review
// @route PUT api/v1/reviews/:id
// @access PRIVATE
exports.updateReview = asyncHandler(async (req, res, next) => {

    const review = await Review.findById(req.params.id)

    if (!review) {
        return next(new ErrorResponse(`Review doesn't exixst with id ${req.params.id}`, 404))
    }


    //to check for user or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to update review`, 401))
    }

    const data = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data
    })

})


// @desc  Delete Review
// @route DELETE api/v1/reviews/:id
// @access PRIVATE
exports.deleteReview = asyncHandler(async (req, res, next) => {

    const review = await Review.findById(req.params.id)

    if (!review) {
        return next(new ErrorResponse(`Review doesn't exixst with id ${req.params.id}`, 404))
    }


    //to check for user or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to update review`, 401))
    }

    await review.remove()

    res.status(200).json({
        success: true,
        data: {}
    })

})