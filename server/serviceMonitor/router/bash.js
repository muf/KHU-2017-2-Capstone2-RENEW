var express = require('express')
var router = express.Router()
var app = express();
var async = require('async');

var dir = new Map();
dir.set('view', __dirname +"/../view/")
dir.set('private', __dirname +"/../private/")

var bash = require(dir.get('private') + 'javascript/common/bash.js')
var count = 0

// @ handle bash requests
router.post('/newServiceRequest',function(req, res, next) {
  var serviceId = req.body._id
  console.log(serviceId)
  // executor 실행
  async.waterfall([
    function(callback) {
      bash.runExecutor(serviceId, function(address){
        callback(null, address)        
      })
    }
  ], function (err, result) {
      // result now equals 'done'

      console.log("executor run return")
      res.json(result)
  });
})

// @ handle bash requests
router.post('/makeClusteredData',function(req, res, next) {

  var path = req.body.path
  var seq = req.body.seq
  
  // executor 실행
  async.waterfall([
    function(callback) {
      bash.runClusterMaker(path, function(clusterPath){
        callback(null, clusterPath)        
      })
    }
  ], function (err, result) {
      // result now equals 'done'

      console.log("make run return")
      res.json(result)
  });
})
    

  // @app use
app.use(function(err, req, res, next) {
    console.log("error check");
    console.log(err);
  })
  
  module.exports = router