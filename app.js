require('dotenv').config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
// const kue = require('kue');
// const cronjobs = require('./helpers/cron.js.js')

// cronjobs.monthlyReport()

if(process.env.NODE_ENV == 'test') {
    mongoose.connect('mongodb://localhost:27017/h8ikeBlogTest',{ useNewUrlParser: true, useCreateIndex: true, useFindAndModify : false })    
} else {
    mongoose.connect('mongodb://h8ikeid:h8ikeid@ds255403.mlab.com:55403/h8ike',{ useNewUrlParser: true, useCreateIndex: true, useFindAndModify : false })  
    // mongoose.connect('mongodb://localhost:27017/h8ikeBlog',{ useNewUrlParser: true, useCreateIndex: true, useFindAndModify : false })
    app.use(logger('dev'));
}
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error"))
mongoose.connection.once("open", ()=> {console.log("MongoDB Connected!")})

const indexRoutes = require('./routes/index.js.js')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())


app.get('/',(req,res)=>{res.status(200).send('Connected - Express App')})
// app.use('/kue-ui', kue.app)
app.use('/', indexRoutes);


module.exports = app;
