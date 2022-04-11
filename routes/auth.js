const express = require('express');
const {
    register,
    login,
    getLoggedInUser
} = require('../controllers/auth')

const {
    protect
} = require('../middlewares/auth')

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getLoggedInUser)

module.exports = router