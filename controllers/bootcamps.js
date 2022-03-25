const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')

// @desc  GET ALL BOOTCAMPS
// @route GET /api/v1/bootcamps
//@access public
exports.getBootcamps = asyncHandler( async (req,res,next) => {
    const data = await Bootcamp.find();
    res.status(200).json({
        success : true,
        count : data.length,
        data 
    }) 
})

// @desc  GET SINGLE BOOTCAMP
// @route GET /api/v1/bootcamps/:id
//@access public
exports.getBootcamp = asyncHandler( async (req,res,next) => {

        const bootcamp = await Bootcamp.findById(req.params.id);

        //if id is correctly formatted but not in the db
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}` , 404))
        }

        res.status(200).json({
            success  :true,
            data : bootcamp
        })
    
})

// @desc  CREATE NEW BOOTCAMP
// @route POST /api/v1/bootcamps
//@access private
exports.createBootcamp = asyncHandler( async (req,res,next) => {
        const data = await Bootcamp.create(req.body);
        res.status(201).json({
            success : true,
            data : data
        })
    
})

// @desc  UPDATE SINGLE BOOTCAMP
// @route PUT /api/v1/bootcamps/:id
//@access private
exports.updateBootcamps = asyncHandler( async (req,res,next) => {
   
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id , req.body , {
            new : true,
            runValidators : true
        })

        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}` , 404))
        }

        res.status(200).json({
            success : true,
            data : bootcamp
        })

})

// @desc  DELETE SINGLE BOOTCAMP
// @route DELTE /api/v1/bootcamps/:id
//@access private
exports.deleteBootcamp = asyncHandler( async (req,res,next) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}` , 404))
        }

        res.status(200).json({
            success : true,
            data : {}
        })

    
})