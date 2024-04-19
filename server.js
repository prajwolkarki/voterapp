const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const db =require("./config/dbConnection");
const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send("Welcome to Homepage");
})


app.use(bodyParser.json());
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);
app.listen(PORT,()=>{
    console.log(`The server is listening to port ${PORT} and live at localhost:${PORT}`);
})


