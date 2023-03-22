const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/inotebook'

mongoose.set('strictQuery', false);
const connectToMongo = ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("connected to mongo successfully !");
    })
}

module.exports = connectToMongo;