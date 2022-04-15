const mongoose = require('mongoose')
const colors = require('colors')

const ReviewScehme = new mongoose.Schema({

    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 100
    },

    text: {
        type: String,
        required: [true, 'Please add some text']
    },

    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating from 1-10']
    },

    createadAt: {
        type: Date,
        default: Date.now
    },

    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

});


//prevent user from submitting more than 1 review per bootcamp
ReviewScehme.index({
    bootcamp: 1,
    user: 1
}, {
    unique: true
})


//static method to get average of rating and save
ReviewScehme.statics.getAverageRating = async function (bootcampId) {
    const obj = await this.aggregate([{
            $match: {
                bootcamp: bootcampId
            }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: {
                    $avg: '$rating'
                }
            }
        }
    ]);

    console.log(obj);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating
        })
    } catch (error) {
        console.log(error);
    }
}

// Call getAverageCost after save
ReviewScehme.post('save', function () {
    this.constructor.getAverageRating(this.bootcamp)
})

// Call getAverageCost before remove
ReviewScehme.pre('remove', function () {
    this.constructor.getAverageRating(this.bootcamp)
})


module.exports = mongoose.model("Review", ReviewScehme)