const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`Mongo DB connected ${conn.connection.host}`);
    } catch (error) {
        console.log("error : ",error.message);
        process.exit()
    }
}

module.exports = connectDB;