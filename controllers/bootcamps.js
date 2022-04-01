const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const geocoder = require('../utils/geoCoder')

// @desc  GET ALL BOOTCAMPS
// @route GET /api/v1/bootcamps
//@access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    let query;

    //copy rqe.query
    const reqQuery = {
        ...req.query
    }

    //array of fields to exclude
    const removeFields = ['select', 'sort']

    //loop over removeFields
    removeFields.forEach(param => delete reqQuery[param])

    //create query string
    let queryString = JSON.stringify(reqQuery)

    console.log(req.query)

    //create operator like gte , gt etc
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    console.log(queryString)

    //filtering resource
    query = Bootcamp.find(JSON.parse(queryString))

    //select fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(' ')
        console.log(fields)
        query = query.select(fields)
    }

    //sorting
    if (req.query.sort) {
        const result = req.query.sort.split(',').join(' ');
        query = query.sort(result)
    } else {
        query = query.sort('-createdAt')
    }

    //executing query
    const data = await query
    res.status(200).json({
        success: true,
        count: data.length,
        data
    })
})

// @desc  GET SINGLE BOOTCAMP
// @route GET /api/v1/bootcamps/:id
//@access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    //if id is correctly formatted but not in the db
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    })

})

// @desc  CREATE NEW BOOTCAMP
// @route POST /api/v1/bootcamps
//@access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const data = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: data
    })

})

// @desc  UPDATE SINGLE BOOTCAMP
// @route PUT /api/v1/bootcamps/:id
//@access private
exports.updateBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    })

})

// @desc  DELETE SINGLE BOOTCAMP
// @route DELTE /api/v1/bootcamps/:id
//@access private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: {}
    })


})

// @desc  GET BOOTCAMPS with in a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance/
//@access private
// exports.getBootcampsInRadius = asyncHandler( async (req,res,next) => {
//     const { zipcode , distance } = req.params;

//     const minConfidence = 0.92

//     //get latitude and longitude
//     const loc = await geocoder.geocode(zipcode);

//     const lat = loc[0].geometery.location.lat;
//     const lng = loc[0].geometery.location.lat

//     console.log(lat , " " , lng)

//     //calcluation for radius
//     const radius = distance / 3963
//     const bootcamps = await Bootcamp.find({
//         location : { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
//     });

//     console.log(bootcamps)

//     res.status(200).json({
//         success : true,
//         count : bootcamps.length,
//         data : bootcamps
//     })
// })


exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const {
        zipcode,
        distance
    } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [lng, lat], radius
                ]
            }
        }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});