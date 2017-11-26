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
router.get('/newServiceRequest',function(req, res, next) {

  // executor 실행
  async.waterfall([
    function(callback) {
      bash.runExecutor(function(proc){
        console.log(count)
        callback(null, proc.pid )        
      })
    },
    // function(pid, callback) {
    //   var pid = bash.getRealPid(pid, function(pid){
    //     callback(null, pid )        
    //   })
    // }
    // function(pid, callback) {
    //     var port = bash.getPortByPid(pid,function(data){
    //       calllback(null, {pid:data.pid, port:data.port})      
    //     })
    // },
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