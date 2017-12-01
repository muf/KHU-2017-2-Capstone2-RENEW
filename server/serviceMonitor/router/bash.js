var express = require('express')
var router = express.Router()
var app = express();
var async = require('async');
var request = require('request')

var dir = new Map();
dir.set('view', __dirname +"/../view/")
dir.set('private', __dirname +"/../private/")

var bash = require(dir.get('private') + 'javascript/common/bash.js')
var count = 0
router.post('/termService',function(req, res, next){
  var pid = req.body.pid
  var serviceId = req.body.serviceId

  bash.termService(req,function(result){
    console.log(result.msg)
    if(result.err){
      return res.status(500).send("fail")
    }
    else{
      request({
        url : "http://localhost:3002/updateServiceApplicationState",
        method:"POST",
        json:true,
        body:{state:"submit", serviceId: result.req.body.serviceId},
        },function (err, response, body) {
            if (err){
              console.log(err)
              return res.status(500).send("fail")
            }
            res.json({msg: result.msg})
        })
    }
  })
})
// @ handle bash requests
router.post('/newServiceRequest',function(req, res, next) {
  var serviceId = req.body._id
  // console.log(serviceId)
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