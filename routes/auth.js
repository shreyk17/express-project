const express = require('express');
const {
    register,
    login,
    getLoggedInUser,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword,
    logout
} = require('../controllers/auth')

const {
    protect
} = require('../middlewares/auth')

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/me', protect, getLoggedInUser)
router.put('/updatedetails', protect, updateDetails)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resetToken', resetPassword)
router.put('/updatepassword', protect, updatePassword)


module.exports = router