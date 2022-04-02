const express = require('express')
const {
    getBootcamp,
    getBootcamps,
    createBootcamp,
    updateBootcamps,
    deleteBootcamp,
    getBootcampsInRadius
} = require('../controllers/bootcamps')

//include other resource
const courseRouter = require('./courses')

const router = express.Router()

//Re-route into other resource router
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zicode/:distance').get(getBootcampsInRadius)

router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcamp).put(updateBootcamps).delete(deleteBootcamp)

module.exports = router