const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const users = require('./routes/users');
const mongoose = require('./config/database'); // Database configuration

const app = express();
app.use(cors());

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));

/*
app.get('/', (req, res) => {
    res.json({"Message" : "Nothing here."});
});
*/


app.use(express.static('public'))

app.use('/users', users);

/*
app.get('/favicon.ico', (req, res) => {
    res.sendStatus(204);
});
*/
// express doesn't consider not found 404 as an error so we need to handle 404 explicitly

app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle errors

app.use(function(err, req, res, next) {
    console.log(err);
    if(err.status === 404) {
        res.status(404).json({message: "Not found"});
    }else{
        res.status(500).json({message: "Something went wrong"});
    }
});


app.listen(6000, () => {console.log('Server listening on port 6000')});
