const { underline } = require('colors');
const mongoose = require('mongoose')

const connectDb = async() => {
    const conn = await mongoose.connect(process.env.MONGO_URI , {
        useNewUrlParser : true,
        // useCreateIndex : true,
        // useFindAndModify : false
        useUnifiedTopology: true 
    });

    console.log(`MongoDB connected  : ${conn.connection.host}`.blue.bold.underline.italic)
}

module.exports = connectDb