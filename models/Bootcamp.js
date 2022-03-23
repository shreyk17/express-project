const mongoose = require('mongoose')

const BootcampScehma = new mongoose.Schema({
    name : {
        type : String,
        required: [true , 'Please add a name'],
        unique : true,
        trim : true,
        maxlength : [150 , 'Name cannot be more than 150 characters'],
    },
    slug : String,

    description : {
        type : String,
        required: [true , 'Please add a name'],
        maxlength : [500 , 'Name cannot be more than 500 characters'],
    },

    website : {
        type : String,
        match : [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },

    phone : {
        type : String,
        maxlength : [10,'Phone number cannot be longer than 10 digits']
    },

    email : {
        type :String,
        match : [
            /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            'Please enter valid email address'
        ]
    },
    
    address: {
        type : String,
        required : [true , 'Please add an address']
    },

    location : {
        //GeoJson type
        type: {
            type: String,
            enum: ['Point'],
            //required: true
        },
        coordinates: {
            type: [Number],
            //required: true,
            index : '2dsphere'
        },

        formattedAddress : String,
        street : String,
        city : String,
        state : String,
        zipcode : String,
        country : String
    },

    careers : {
        //array of string
        type : [String],
        required : true,
        enum : [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Bussiness',
            'Other'
        ]
    },

    averageRating : {
        type : Number,
        min : [1 , 'Rating must be at least 1'],
        max : [10 , "Rating must cannnot be more than 10"],
    },

    averageCost : {
        type : Number
    },

    photo  :{
        type : String,
        default : 'no-photo.jpeg'
    },

    housing : {
        type : Boolean,
        default : false
    },

    jobAssistance : {
        type : Boolean,
        default : false
    },

    jobGurrantee : {
        type : Boolean,
        default : false
    },

    accepGI : {
        type : Boolean,
        default : false
    },

    createdAt : {
        type : Date,
        default : Date.now
    },

});

module.exports = mongoose.model("Bootcamp" , BootcampScehma)