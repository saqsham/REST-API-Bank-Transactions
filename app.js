const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
require('./src/config/config')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("> ok");
});

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

// Routes
require('./src/routes')(app);
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome'
}));    

module.exports = app;