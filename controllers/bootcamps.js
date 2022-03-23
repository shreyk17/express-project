const Bootcamp = require('../models/Bootcamp')

// @desc  GET ALL BOOTCAMPS
// @route GET /api/v1/bootcamps
//@access public
exports.getBootcamps = async (req,res,next) => {
    try {
        const data = await Bootcamp.find();

        res.status(200).json({
            success : true,
            count : data.length,
            data 
        })
    } catch (error) {
        res.status(400).json({
            success : false,
            error : error
        })
    }   
}

// @desc  GET SINGLE BOOTCAMP
// @route GET /api/v1/bootcamps/:id
//@access public
exports.getBootcamp = async (req,res,next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp){
            return res.status(400).json({
                success : false,
                error : error.message
            })
        }

        res.status(200).json({
            success  :true,
            data : bootcamp
        })
    } catch (error) {
        res.status(400).json({
            success : false,
            error : `No data available for ${req.params.id}`
        })
    }
}

// @desc  CREATE NEW BOOTCAMP
// @route POST /api/v1/bootcamps
//@access private
exports.createBootcamp = async (req,res,next) => {
    try {
        const data = await Bootcamp.create(req.body);
        res.status(201).json({
            success : true,
            data : data
        })
    } catch (error) {
        res.status(400).json({
            suucess : false,
            error : 'Something went wrong.'
        })
    }
}

// @desc  UPDATE SINGLE BOOTCAMP
// @route PUT /api/v1/bootcamps/:id
//@access private
exports.updateBootcamps = async (req,res,next) => {
    try{
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id , req.body , {
            new : true,
            runValidators : true
        })

        if(!bootcamp){
            return res.status(400).json({
                success : false,
                error : `No data available for ${req.params.id}`
            })
        }

        res.status(200).json({
            success : true,
            data : bootcamp
        })
    }catch(err){
        res.status(400).json({
            suucess : false,
            error : 'Something went wrong.'
        })
    }

}

// @desc  DELETE SINGLE BOOTCAMP
// @route DELTE /api/v1/bootcamps/:id
//@access private
exports.deleteBootcamp = async (req,res,next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

        if(!bootcamp){
            return res.status(400).json({
                success : false,
                error : `No data available for ${req.params.id}`
            })
        }

        res.status(200).json({
            success : true,
            data : {}
        })

    } catch (error) {
        res.status(400).json({
            success : false,
            error : error.message
        })
    }
}