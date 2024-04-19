
const mongoose = require('mongoose');
const mongooseURL = 'mongodb://localhost:27017/voter';

mongoose.connect(mongooseURL)


const db = mongoose.connection;


db.on('connected',()=>{
    console.log("MongoDB database connected successfully");
})
db.on('error',(err)=>{
    console.log("MongoDB database connection error",err);
})
db.on('disconnected',()=>{
    console.log("MongoDB database disconnected ");
})