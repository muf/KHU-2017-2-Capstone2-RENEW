var express = require('express')
var router = express.Router()
var app = express()
// @@@ 이걸.. conf에서 가져와야 하는데.. 좀 꼬였다 ㅠ conf 를 다시 require 할까 그냥.. 나중에 확인하고 처리해보도록 하자.
// @db setting
var mongoose = require('mongoose');
mongoose.connect('mongodb://root:admin@ds117136.mlab.com:17136/ap-in-the-sky',{
	useMongoClient: true,
	/* other options */
  })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log("mongo db connection OK.");
});

var serviceApplication = require('../model/serviceApplication')
var book = require('../model/book')


// @get schema 
// var serviceApplication = require('../model/serviceApplication')

// @ajax GET

// @ajax POST
// // serviceApplication 생성
router.
post('/createServiceApplication', function(req, res) {
    serviceApplication.create( {
            serviceStartDate: req.body.serviceStartDate,
            serviceEndDate: req.body.serviceEndDate,
            drone:{min: req.body.droneMin, max: req.body.droneMax},
            contact:{email: req.body.email, number: req.body.contactNumber},
            bounds:req.body.bounds
            
		},
        function(err, serviceApplication) {
            if (err) return res.status(500).send("serviceApplication 생성 실패.");
            res.status(200).send(serviceApplication); // ? 뭘 보내는 거냐 // {"__v":0,"serviceStartDate":"2017-11-21T12:04:02.687Z","serviceEndDate":"2017-11-21T12:04:02.687Z","_id":"5a141632a8b0e03f802cef20","state":"applied","contact":{"email":"","number":""},"drone":{"max":0,"min":0},"bounds":{"max":{"lng":0,"lat":0},"min":{"lng":0,"lat":0}},"loggingDate":"2017-11-21T12:04:02.688Z"}
        });
});


  
module.exports = router