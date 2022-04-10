const Course = require('../models/Course')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async');
const Bootcamp = require('../models/Bootcamp');


// @desc  GET ALL COURSES
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public
exports.getCourses = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const courses = await Course.find({
            bootcamp: req.params.bootcampId
        })
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        res.status(200).json(res.advancedResults)
    }

})


// @desc  GET SINGLE COURSES
// @route GET /api/v1/courses/:id
// @access public
exports.getCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    // console.log(course)

    if (!course) {
        return next(new ErrorResponse(`No course with id of ${req.params.id}`), 404)
    }

    res.status(200).json({
        success: true,
        data: course
    })

})

// @desc  CREATE COURSE
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access private
exports.createCourse = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    // console.log(bootcamp)

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`), 404)
    }

    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        data: course
    })

})

// @desc  UPDATE COURSE
// @route PUT /api/v1/courses/:id
// @access private
exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id)

    // console.log(course)

    if (!course) {
        return next(new ErrorResponse(`No course with id of ${req.params.course}`), 404)
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: course
    })

})

// @desc  DELETE COURSE
// @route DELTE /api/v1/courses/:id
// @access private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id)

    // console.log(course)

    if (!course) {
        return next(new ErrorResponse(`No course with id of ${req.params.course}`), 404)
    }

    await course.remove()

    res.status(200).json({
        success: true,
        data: {}
    })

})