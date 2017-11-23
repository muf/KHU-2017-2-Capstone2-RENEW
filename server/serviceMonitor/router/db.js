var express = require('express')
var router = express.Router()
var app = express()
var cors = require('cors');
// @ create db connector
var mongoose = require('mongoose');
mongoose.connect('mongodb://root:admin@ds117136.mlab.com:17136/ap-in-the-sky',{
    useMongoClient: true
  })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log("mongo db connection OK.");
});

var dir = new Map();
dir.set('view', __dirname +"/../view/")
dir.set('private', __dirname +"/../private/")

// @ load models & methods
var dao = require(dir.get('private') + 'javascript/common/db.js')

// APIs
// cross domain request 허용
router.post('/createServiceApplication', cors(), function(req, res) { 
    dao.putService(req, res, function(err, res, serviceApplication){
            if (err) return res.status(500).send("serviceApplication 생성 실패.");
            res.status(200).send(serviceApplication);
        });
});
router.post('/addDrone', function(req, res) {
    dao.putDrone(req, res, function(err, res, drone){
        if (err) return res.status(500).send("drone 생성 실패.");
        res.status(200).send(drone);
    });
});
router.post('/updateServiceApplicationState', function(req, res) {
    dao.updateService(req, res, function(err, res, drone){
        if (err) return res.status(500).send("drone 생성 실패.");
        res.status(200).send(drone);
    });
});

module.exports = router