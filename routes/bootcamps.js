const express = require('express')
const { 
    getBootcamp, 
    getBootcamps, 
    createBootcamp, 
    updateBootcamps, 
    deleteBootcamp , 
    getBootcampsInRadius 
} = require('../controllers/bootcamps')
const router = express.Router()

router.route('/radius/:zicode/:distance').get(getBootcampsInRadius)

router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcamp).put(updateBootcamps).delete(deleteBootcamp)

module.exports = router