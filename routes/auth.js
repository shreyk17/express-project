const express = require('express');
const {
    register,
    login,
    getLoggedInUser,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
} = require('../controllers/auth')

const {
    protect
} = require('../middlewares/auth')

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getLoggedInUser)
router.put('/updatedetails', protect, updateDetails)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resetToken', resetPassword)
router.put('/updatepassword', protect, updatePassword)

module.exports = router