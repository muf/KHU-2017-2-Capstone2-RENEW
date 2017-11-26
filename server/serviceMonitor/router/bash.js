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
  var serviceId = req.body.serviceId
  console.log(serviceId)
  // executor 실행
  async.waterfall([
    function(callback) {
      bash.runExecutor(serviceId, function(port){

        callback(null, port)        
      })
    }
  ], function (err, result) {
      // result now equals 'done'
      res.json(result)
  });
    
})
    

  // @app use
app.use(function(err, req, res, next) {
    console.log("error check");
    console.log(err);
  })
  
  module.exports = router