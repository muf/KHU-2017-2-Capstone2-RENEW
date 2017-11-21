
// load server configurations
var conf = require('./conf/main').get(process.env.NODE_ENV).server.conf
console.log(conf)

// load node modules
var express = require('express')
var path = require('path');
var bodyParser = require('body-parser');

// sub app require

// module require

// make instances
var app = express()

// on application

// set application

// use application
app.use(express.static(path.join(__dirname, 'public'))); // static default path to public ex) /css == ... $ROOT/public/css
app.use(bodyParser.json()); // parse body of response to json 
app.use(bodyParser.urlencoded({ extended: false })); // parse the text as url encoded data. [false]:parse only once. [true]:parse every time (?????)

// use error check
app.use(function(err, req, res, next) {
  console.log("ERROR : APP.JS");
  console.log("MSG: "+err);
})

// connect sub apps

// listen application
app.listen(conf.server.port, function(){
  console.log("Application [ %s ]Running on %s port", conf.server.name, conf.server.port);
});



