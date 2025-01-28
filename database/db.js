const mongoose = require('mongoose')
const dotenv = require('dotenv')

const connectToDB = async () => {

    try {

        mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9yny4.mongodb.net/MongoDbAuthUsers`)
        console.log(`MongoDB connection successful`);

    } catch (error) {
        console.log(`MongoDB connection unsuccessful -> ${error.message}`);
    }

}


module.exports = connectToDB
