
// @desc  GET ALL BOOTCAMPS
// @route GET /api/v1/bootcamps
//@access public
exports.getBootcamps = (req,res,next) => {
    res.status(200).json({
        success : true,
        message : 'Show all bootcamps',
        // hello : req.hello
    })
}

// @desc  GET SINGLE BOOTCAMP
// @route GET /api/v1/bootcamps/:id
//@access public
exports.getBootcamp = (req,res,next) => {
    res.status(200).json({
        success : true,
        message : `Get bootcamp ${req.params.id}`
    })
}

// @desc  CREATE NEW BOOTCAMP
// @route POST /api/v1/bootcamps
//@access private
exports.createBootcamp = (req,res,next) => {
    res.status(200).json({
        success : true,
        message : 'Create new bootcamps'
    })
}

// @desc  UPDATE SINGLE BOOTCAMP
// @route PUT /api/v1/bootcamps/:id
//@access private
exports.updateBootcamps = (req,res,next) => {
    res.status(200).json({
        success : true,
        message : `Update bootcamp ${req.params.id}`
    })
}

// @desc  DELETE SINGLE BOOTCAMP
// @route DELTE /api/v1/bootcamps/:id
//@access private
exports.deleteBootcamp = (req,res,next) => {
    res.status(200).json({
        success : true,
        message : `Delete bootcamp ${req.params.id}`
    })
}