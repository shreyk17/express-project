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
    protect,
    authorize
} = require('../middlewares/auth')

const advancedResults = require('../middlewares/advancedResults')
const Bootcamp = require('../models/Bootcamp')

//include other resource
const courseRouter = require('./courses')
const reviewRouter = require('./reviews')

const router = express.Router()

//Re-route into other resource router
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)

router.route('/radius/:zicode/:distance').get(getBootcampsInRadius)

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp)
router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamps)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)

module.exports = router