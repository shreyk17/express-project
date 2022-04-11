const express = require('express')
const {
    getBootcamp,
    getBootcamps,
    createBootcamp,
    updateBootcamps,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps')

const {
    protect
} = require('../middlewares/auth')

const advancedResults = require('../middlewares/advancedResults')
const Bootcamp = require('../models/Bootcamp')

//include other resource
const courseRouter = require('./courses')

const router = express.Router()

//Re-route into other resource router
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zicode/:distance').get(getBootcampsInRadius)

router.route('/:id/photo').put(protect, bootcampPhotoUpload)

router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, createBootcamp)
router.route('/:id').get(getBootcamp).put(protect, updateBootcamps).delete(protect, deleteBootcamp)

module.exports = router