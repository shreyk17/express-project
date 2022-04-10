const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please add a name"]
    },

    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            'Please enter valid email address'
        ]
    },

    role: {
        type: String,
        enum: ["user", "publisher"],
        default: 'user'
    },

    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false
    },

    resetPasswordToken: {
        type: String
    },

    resetPasswordExpire: {
        type: Date
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

//encrypt password using bcrypt
UserSchema.pre('save', async function (next) {

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

})


module.exports = mongoose.model('User', UserSchema)